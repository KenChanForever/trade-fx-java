package trade.fx.backend.service;

import trade.fx.backend.PostTradeWebSocketController;
import trade.fx.backend.entity.Trade;
import trade.fx.backend.repository.TradeRepository;
import trade.fx.backend.vo.TradeUpdateStatusVo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class TradeService {

    @Autowired
    private TradeRepository tradeRepository;


    @Autowired
    private PostTradeWebSocketController postTradeWebSocketController;


    private static final String SUCCESS = "SUCCESS";
    private static final String FAILURE = "FAILURE";
    private static final String PENDING = "PENDING";


    private Logger logger = LoggerFactory.getLogger(TradeService.class);
    public List<Trade> listAllTrade() {
        logger.info("listAllTrade");
        return tradeRepository.findAll().stream().sorted(new Comparator<Trade>() {
            @Override
            public int compare(Trade o1, Trade o2) {
                if (PENDING.equals(o1.getStatus())) return -1;
                else if (PENDING.equals(o2.getStatus())) return 1;

                return new Date(o1.getTimePlaced()).after(new Date(o2.getTimePlaced())) ? -1 : 1;
            }
        }).collect(Collectors.toList());
    }

    public void createTrade(Trade trade) {
        logger.info("createTrade");
        sanityCheck(trade);
        trade = bookmarkTrade(trade);
        postTradeWebSocketController.createTrade(trade);
        postTradeWebSocketController.updateStatus(TradeUpdateStatusVo.builder().tradeId(trade.getId())
                                                                                .status(PENDING)
                                                                                .progress(20).build());
        processTrade(trade);

    }

    private void sanityCheck(Trade trade) {
        if (trade.getTimePlaced() == null || trade.getTimePlaced().length() != 18) {
            throw new RuntimeException("trade getTimePlace format has problems");
        }
    }

    private void processTrade(Trade trade) {
        ExecutorService executorService = Executors.newCachedThreadPool();
        executorService.submit(new SubmitToExchange(trade));
    }

    private Trade bookmarkTrade(Trade trade) {
        //db update status and insert to db
        trade.setCreateTime(new Timestamp(new Date().getTime()));
        trade.setUpdateTime(trade.getCreateTime());
        trade.setStatus(PENDING);
        return tradeRepository.save(trade);
    }

    private Trade finishTrade(Trade trade) {
        if (Math.floor(Math.random() * 300) % 2 == 0) trade.setStatus(FAILURE);
        else trade.setStatus(SUCCESS);
        trade.setUpdateTime(new Timestamp(new Date().getTime()));
        return tradeRepository.save(trade);
    }



    class SubmitToExchange implements Runnable {

        public SubmitToExchange(Trade trade) {
            this.trade = trade;
        }

        public void run() {

            try {

                // stimulate connect to exchange and trade FX
                // totally sleep for 8 seconds
                int sleepSecond = 2;
                System.out.println("Thread Name:" +Thread.currentThread().getName());
                TimeUnit.SECONDS.sleep(sleepSecond);
                postTradeWebSocketController.updateStatus(TradeUpdateStatusVo.builder().tradeId(trade.getId())
                        .status(PENDING)
                        .progress(40).build());

                TimeUnit.SECONDS.sleep(sleepSecond);
                postTradeWebSocketController.updateStatus(TradeUpdateStatusVo.builder().tradeId(trade.getId())
                        .status(PENDING)
                        .progress(60).build());

                TimeUnit.SECONDS.sleep(sleepSecond);
                postTradeWebSocketController.updateStatus(TradeUpdateStatusVo.builder().tradeId(trade.getId())
                        .status(PENDING)
                        .progress(80).build());

                TimeUnit.SECONDS.sleep(sleepSecond);

                System.out.println("after sleep Thread Name:" +Thread.currentThread().getName());
                System.out.println("after sleep time :" + trade.getTimePlaced());

                trade = finishTrade(trade);
                //call websocket to notify user in frontend the status of trade.
                postTradeWebSocketController.updateStatus(TradeUpdateStatusVo.builder()
                                                                     .tradeId(trade.getId())
                                                                     .progress(100)
                                                                     .status(trade.getStatus())
                                                                     .build());


            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        private Trade trade;

    }
}

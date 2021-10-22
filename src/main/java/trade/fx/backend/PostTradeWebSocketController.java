package trade.fx.backend;

import trade.fx.backend.entity.Trade;
import trade.fx.backend.vo.TradeUpdateStatusVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class PostTradeWebSocketController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/user-update-status")
    public void updateStatus(@Payload TradeUpdateStatusVo statusVo) {
        this.simpMessagingTemplate.convertAndSend("/topic/update-status", statusVo);
    }

    @MessageMapping("/user-create-trade")
    public void createTrade(@Payload Trade trade) {
        this.simpMessagingTemplate.convertAndSend("/topic/create-trade", trade);
    }
}

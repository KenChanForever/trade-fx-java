package trade.fx.backend;

import trade.fx.backend.entity.Trade;
import trade.fx.backend.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/trade")
public class TradeController {

    @Autowired
    private TradeService tradeService;
    
    
    @PostMapping(value = "/create")
    public void createTrade(@RequestBody Trade trade) {
        tradeService.createTrade(trade);
    }

    @GetMapping(value = "/listAll")
    public List<Trade> listAllTrade() {
        return tradeService.listAllTrade();
    }


}

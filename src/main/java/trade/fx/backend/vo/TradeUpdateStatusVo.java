package trade.fx.backend.vo;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TradeUpdateStatusVo {
    private Long tradeId;
    private String status;
    private Integer progress;
}

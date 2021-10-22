package trade.fx.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "trade")
@Builder
public class Trade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String currencyFrom;

    private String currencyTo;

    private Double amountSell;

    private Double amountBuy;

    private Double rate;

    private String timePlaced;

    private String originatingCountry;

    private String status;

    private Timestamp createTime;

    private Timestamp updateTime;
}

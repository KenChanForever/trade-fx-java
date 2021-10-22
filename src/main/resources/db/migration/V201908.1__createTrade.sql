DROP TABLE IF EXISTS trade;

CREATE TABLE trade (
  id                           BIGSERIAL                NOT NULL,
  user_id                      TEXT                NOT NULL,
  currency_from                TEXT                     NOT NULL,
  currency_to                  TEXT                     NOT NULL,
  amount_sell                  DOUBLE PRECISION            NOT NULL,
  amount_buy                   DOUBLE PRECISION                     NOT NULL,
  rate                         DOUBLE PRECISION                     NOT NULL,
  time_placed                  TEXT                NOT NULL,
  originating_country          TEXT                     NOT NULL,
  status                       TEXT,
  create_time                  TIMESTAMP                ,
  update_time                  TIMESTAMP                ,
  CONSTRAINT                   trade_pkey  PRIMARY KEY (id)
);

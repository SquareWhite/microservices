CREATE TABLE transactions (
  id             SERIAL NOT NULL,
  account_id     int4,
  amount         double precision,
  date_completed timestamp,
  PRIMARY KEY (id));

CREATE TABLE accounts (
  id          SERIAL NOT NULL,
  name        varchar(255),
  middle_name varchar(255),
  surname     varchar(255),
  address     varchar(255),
  credit_card varchar(16),
  cvv         varchar(3),
  PRIMARY KEY (id));

ALTER TABLE transactions ADD CONSTRAINT FKtransactions401936 FOREIGN KEY (account_id) REFERENCES accounts (id);

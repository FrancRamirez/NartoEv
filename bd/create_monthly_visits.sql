CREATE TABLE IF NOT EXISTS monthly_visits (
  month CHAR(7) NOT NULL,
  count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (month)
);

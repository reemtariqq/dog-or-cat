use prefs
DROP TABLE IF EXISTS records;
CREATE TABLE records (
  id         INT AUTO_INCREMENT NOT NULL,
  selection      VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO records
  (selection)
VALUES
('dog'),
('dog'),
('cat'),
('dog'),
('cat')


INSERT INTO accounts (id, name, middle_name, surname, address, credit_card, cvv)
VALUES (1, 'name1', 'mid_name1', 'surname1', 'address' , '1234123412341234', '123');
INSERT INTO accounts (id, name, middle_name, surname, address, credit_card, cvv)
VALUES (2, 'name2', 'mid_name2', 'surname22', 'address', '1234123412341234', '123');
INSERT INTO accounts (id, name, middle_name, surname, address, credit_card, cvv)
VALUES (3, 'name3', 'mid_name3', 'surname3', 'address' , '1234123412341234', '123');
INSERT INTO accounts (id, name, middle_name, surname, address, credit_card, cvv)
VALUES (4, 'name4', 'mid_name4', 'surname44', 'address', '1234123412341234', '123');

INSERT INTO transactions (id, account_id, amount, date_completed) VALUES (1, 1, 1234.0, current_date);
INSERT INTO transactions (id, account_id, amount, date_completed) VALUES (2, 1, 1234.0, current_date);
INSERT INTO transactions (id, account_id, amount, date_completed) VALUES (3, 1, 1234.0, current_date);
INSERT INTO transactions (id, account_id, amount, date_completed) VALUES (4, 2, 1234.0, current_date);
INSERT INTO transactions (id, account_id, amount, date_completed) VALUES (5, 2, 1234.0, current_date);
INSERT INTO transactions (id, account_id, amount, date_completed) VALUES (6, 3, 1234.0, current_date);

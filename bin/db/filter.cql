# Get message desc
select * from chat_messages where from_user = '' and to_user = '' order by created_date desc;

# Get latest messge
select * from chat_messages where from_user = '' and to_user = '' order by created_date desc limit 1;
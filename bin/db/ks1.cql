
CREATE KEYSPACE ks1 WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;

CREATE TABLE ks1.friend_requests_by_emails (
    user_email text,
    accepted boolean,
    friend_email text,
    created_date timestamp,
    PRIMARY KEY (user_email, accepted, friend_email)
);

CREATE TABLE ks1.friends_by_useremail_and_friendemail (
    user_email text,
    friend_email text,
    created_date timestamp,
    friend_username text,
    PRIMARY KEY (user_email, friend_email)
);

CREATE TABLE ks1.user_by_email (
    email text PRIMARY KEY,
    created_date timestamp,
    password text,
    username text
);

CREATE TABLE ks1.chat_messages(
    from_user text, 
    to_user text, 
    message_id bigint, 
    created_date timestamp, 
    message text, 
    PRIMARY KEY((from_user, to_user),created_date)
);

CREATE TABLE ks1.group_chat_messages(
    group_id bigint, 
    group_name text, 
    created_date timestamp, 
    message text,
    message_id bigint,
    sentBy text, 
    PRIMARY KEY((group_id, group_name),created_date)
);
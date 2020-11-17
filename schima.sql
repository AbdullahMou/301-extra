create table fact(
    id serial primary key,
    type varchar(255),
    text  varchar(255)
);
insert into fact (type,text)values('type1','text1');
insert into fact (type,text)values('type2','text2');

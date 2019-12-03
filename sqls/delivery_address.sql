drop table if exists `delivery_address`;
create table if not exists `delivery_address` (
	`registration_phone_number` varchar(16) not null comment '注册号码',
	`address_number` integer unsigned not null comment '地址编号',
	`receiver_name` varchar(32) not null comment '收货人姓名',
	`receiver_phone_number` varchar(16) not null comment '收货人号码',
	`province` varchar(32) not null comment '省',
	`city` varchar(32) not null comment '市',
	`district` varchar(32) not null comment '区',
	`street` varchar(32) not null comment '街道',
	`detailed_address` varchar(128) not null comment '详细地址',
	`postcode` varchar(8) not null comment '邮政编码',
	`is_default_address` tinyint unsigned not null default 0 comment '默认地址：0-否，1-是',
	`create_time` timestamp not null default current_timestamp comment '创建时间',
	`update_time` timestamp not null default current_timestamp on update current_timestamp comment '更新时间',
	primary key(`registration_phone_number`, `address_number`)
) engine=InnoDB default charset=UTF8;

alter table `delivery_address`
add constraint `fk_delivery_address_registration_phone_number_user`
foreign key(`registration_phone_number`)
references `user`(`registration_phone_number`)
on update cascade;

alter table `delivery_address`
drop foreign key `fk_delivery_address_registration_phone_number_user`;

show index from `delivery_address`;

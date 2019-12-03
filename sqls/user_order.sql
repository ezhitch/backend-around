drop table if exists `user_order`;
create table if not exists `user_order` (
	`registration_phone_number` varchar(16) not null comment '注册号码',
	`order_number` varchar(64) not null comment '订单编号',
	`order_status` varchar(16) not null default '待付款' comment '订单状态：待付款、已付款、已取消、已失效、已完成',
	`serial_number` varchar(128) not null comment '商品序列号',
	`quantity` integer unsigned not null comment '数量',
	`address_number` integer unsigned not null comment '地址编号',
	`payment_number` varchar(64) comment '支付编号',
	`payment_type` varchar(32) comment '支付类型：微信支付、支付宝支付',
	`payment_amount` decimal(12, 2) comment '支付总额',
	`payment_time` timestamp null default null comment '支付时间',
	`delivery_number` varchar(32) comment '快递单号',
	`delivery_status` varchar(32) comment '快递状态：处理中、已出库、派送中、已签收',
	`delivery_price` decimal(12, 2) comment '运费',
	`delivery_carrier` varchar(32) comment '承运人',
	`delivery_time` timestamp null default null comment '发货时间',
	`deal_time` timestamp null default null comment '成交时间',
	`create_time` timestamp not null default current_timestamp comment '创建时间',
	`update_time` timestamp not null default current_timestamp on update current_timestamp comment '更新时间',
	primary key(`registration_phone_number`, `order_number`, `serial_number`)
) engine=InnoDB default charset=UTF8;

alter table `user_order`
add constraint `fk_user_order_registration_phone_number_user`
foreign key(`registration_phone_number`)
references `user`(`registration_phone_number`)
on update cascade;

alter table `user_order`
drop foreign key `fk_user_order_registration_phone_number_user`;

create unique index `idx_user_order_payment_number` on `user_order`(`payment_number`);
create unique index `idx_user_order_delivery_number` on `user_order`(`delivery_number`);
drop index `idx_user_order_payment_number` on `user_order`;
drop index `idx_user_order_delivery_number` on `user_order`;

show index from `user_order`;

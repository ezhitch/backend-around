drop table if exists `shopping_cart`;
create table if not exists `shopping_cart` (
	`registration_phone_number` varchar(16) not null comment '注册号码',
	`serial_number` varchar(128) not null comment '商品序列号',
	`quantity` integer unsigned not null comment '数量',
	`create_time` timestamp not null default current_timestamp comment '创建时间',
	`update_time` timestamp not null default current_timestamp on update current_timestamp comment '更新时间',
	primary key(`registration_phone_number`, `serial_number`)
) engine=InnoDB default charset=UTF8;

alter table `shopping_cart`
add constraint `fk_shopping_cart_registration_phone_number_user`
foreign key(`registration_phone_number`)
references `user`(`registration_phone_number`)
on update cascade;

alter table `shopping_cart`
add constraint `fk_shopping_cart_serial_number_commodity_details`
foreign key(`serial_number`)
references `commodity_details`(`serial_number`)
on update cascade;

alter table `shopping_cart`
drop foreign key `fk_shopping_cart_registration_phone_number_user`;

alter table `shopping_cart`
drop foreign key `fk_shopping_cart_serial_number_commodity_details`;

show index from `shopping_cart`;

select *
from shopping_cart a, commodity_details b
where registration_phone_number = 13800138000
and a.serial_number = b.serial_number;

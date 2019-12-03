drop table if exists `commodity_details`;
create table if not exists `commodity_details` (
	`serial_number` varchar(128) not null comment '商品序列号',
	`name` varchar(128) not null comment '名称',
	`image_path` varchar(128) not null comment '图片路径',
	`price` decimal(12, 2) not null comment '价格',
	`price_unit` varchar(8) not null default '¥' comment '货币单位',
	`inventory` integer unsigned not null comment '库存',
	`sales_volume` integer unsigned not null comment '销售量',
	`origin` varchar(128) not null comment '源产地',
	`description` varchar(1024) comment '描述',
	`create_time` timestamp not null default current_timestamp comment '创建时间',
	`update_time` timestamp not null default current_timestamp on update current_timestamp comment '更新时间',
	primary key(`serial_number`)
) engine=InnoDB default charset=UTF8;

show index from `commodity_details`;

insert into `commodity_details`(
	`serial_number`,
	`name`,
	`image_path`,
	`price`,
	`price_unit`,
	`inventory`,
	`sales_volume`,
	`origin`,
	`description`
) values(
	'5243d720-4863-11e8-a6c9-2f79185b3ec0',
	'舞蝶戏花大瓶',
	'http://47.106.138.113:80/static/%E8%88%9E%E8%9D%B6%E6%88%8F%E8%8A%B1%E5%A4%A7%E7%93%B6.jpg',
	199.00,
	'¥',
	200,
	32,
	'江西景德镇',
	'江西景德镇-舞蝶戏花大瓶-高80cm-2010年'
);
insert into `commodity_details`(
	`serial_number`,
	`name`,
	`image_path`,
	`price`,
	`price_unit`,
	`inventory`,
	`sales_volume`,
	`origin`,
	`description`
) values(
	'5243d720-4863-11e8-a6c9-2f79185b3ec1',
	'舞蝶戏花大瓶',
	'http://47.106.138.113:80/static/%E8%88%9E%E8%9D%B6%E6%88%8F%E8%8A%B1%E5%A4%A7%E7%93%B6.jpg',
	99.00,
	'$',
	200,
	32,
	'江西景德镇',
	'江西景德镇-舞蝶戏花大瓶-高80cm-2010年'
);
insert into `commodity_details`(
	`serial_number`,
	`name`,
	`image_path`,
	`price`,
	`price_unit`,
	`inventory`,
	`sales_volume`,
	`origin`,
	`description`
) values(
	'5243d720-4863-11e8-a6c9-2f79185b3ec2',
	'舞蝶戏花大瓶',
	'http://47.106.138.113:80/static/%E8%88%9E%E8%9D%B6%E6%88%8F%E8%8A%B1%E5%A4%A7%E7%93%B6.jpg',
	399.00,
	'¥',
	20,
	232,
	'江西景德镇',
	'江西景德镇-舞蝶戏花大瓶-高80cm-2010年'
);
commit;

select * from `commodity_details`;

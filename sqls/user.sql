drop table if exists `user`;
create table if not exists `user` (
	`registration_phone_number` varchar(16) not null comment '注册号码',
	`password` varchar(256) not null comment 'AES256密码',
	`is_login` tinyint unsigned not null default 0 comment '登录状态：0-退出，1-登录',
	`create_time` timestamp not null default current_timestamp comment '创建时间',
	`update_time` timestamp not null default current_timestamp on update current_timestamp comment '更新时间',
	primary key(`registration_phone_number`)
) engine=InnoDB default charset=UTF8;

create index `idx_user_is_login` on `user`(`is_login`);
drop index `idx_user_is_login` on `user`;

show index from `user`;

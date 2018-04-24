const config = require('../config/default.js');
let mysql = require('mysql');

let pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE,
  port     : config.database.PORT
});

let query = ( sql, values ) => {
  return new Promise(( resolve, reject ) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

let users =
    `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     pass VARCHAR(100) NOT NULL,
     avator VARCHAR(100) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let posts =
    `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     title TEXT(0) NOT NULL,
     content TEXT(0) NOT NULL,
     md TEXT(0) NOT NULL,
     uid VARCHAR(40) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     comments VARCHAR(200) NOT NULL DEFAULT '0',
     pv VARCHAR(40) NOT NULL DEFAULT '0',
     avator VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let comment =
    `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     content TEXT(0) NOT NULL,
     moment VARCHAR(40) NOT NULL,
     postid VARCHAR(40) NOT NULL,
     avator VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let createTable = sql => {
  return query(sql, []);
};

// 建表
createTable(users);
createTable(posts);
createTable(comment);

// 注册用户
let insertData =  ( value ) => {
  let sql = 'insert into users set name=?,pass=?,avator=?,moment=?;';
  return query(sql, value);
};
// 删除用户
let deleteUserData = ( name ) => {
  let sql = `delete from users where name='${name}';`;
  return query(sql);
};
// 查找用户
let findUserData = ( name ) => {
  let sql = `select * from users where name='${name}';`;
  return query(sql);
};
// 发表文章
let insertPost = ( value ) => {
  let sql = 'insert into posts set name=?,title=?,content=?,md=?,uid=?,moment=?,avator=?;';
  return query(sql, value);
};
// 更新文章评论数
let updatePostComment = ( value ) => {
  let sql = 'update posts set comments=? where id=?';
  return query(sql, value);
};

// 更新浏览数
let updatePostPv = ( value ) => {
  let sql = 'update posts set pv=? where id=?';
  return query(sql, value);
};

// 发表评论
let insertComment = ( value ) => {
  let sql = 'insert into comment set name=?,content=?,moment=?,postid=?,avator=?;';
  return query(sql, value);
};
// 通过名字查找用户
let findDataByName =  ( name ) => {
  let sql = `select * from users where name='${name}';`
  return query(sql);
};
// 通过文章的名字查找用户
let findDataByUser =  ( name ) => {
  let sql = `select * from posts where name='${name}';`
  return query(sql);
};
// 通过文章id查找
let findDataById =  ( id ) => {
  let sql = `select * from posts where id='${id}';`
  return query(sql);
};
// 通过文章id查找
let findCommentById =  ( id ) => {
  let sql = `select * FROM comment where postid='${id}';`
  return query(sql);
}
// 通过评论id查找
let findComment =  ( id ) => {
  let sql = `select * FROM comment where id='${id}';`
  return query(sql);
}

// 查询所有文章
let findAllPost =  () => {
  let sql = ` select * FROM posts;`
  return query(sql);
}
// 查询分页文章
let findPostByPage =  ( page ) => {
  let sql = ` select * FROM posts limit ${(page-1)*10},10;`
  return query(sql);
}
// 查询个人分页文章
let findPostByUserPage =  (name,page) => {
  let sql = ` select * FROM posts where name='${name}' order by id desc limit ${(page-1)*10},10 ;`
  return query(sql);
}
// 更新修改文章
let updatePost = (values) => {
  let sql = `update posts set title=?,content=?,md=? where id=?`
  return query(sql,values);
}
// 删除文章
let deletePost = (id) => {
  let sql = `delete from posts where id = ${id}`
  return query(sql);
}
// 删除评论
let deleteComment = (id) => {
  let sql = `delete from comment where id=${id}`
  return query(sql);
}
// 删除所有评论
let deleteAllPostComment = (id) => {
  let sql = `delete from comment where postid=${id}`
  return query(sql);
}
// 查找评论数
let findCommentLength = (id) => {
  let sql = `select content from comment where postid in (select id from posts where id=${id})`
  return query(sql);
}

// 滚动无限加载数据
let findPageById = (page) => {
  let sql = `select * from posts limit ${(page-1)*5},5;`
  return query(sql);
}
// 评论分页
let findCommentByPage = (page,postId) => {
  let sql = `select * from comment where postid=${postId} order by id desc limit ${(page-1)*10},10;`
  return query(sql);
}

module.exports = {
	query,
	createTable,
	insertData,
  deleteUserData,
  findUserData,
	findDataByName,
  insertPost,
  findAllPost,
  findPostByPage,
  findPostByUserPage,
  findDataByUser,
  findDataById,
  insertComment,
  findCommentById,
  findComment,
  updatePost,
  deletePost,
  deleteComment,
  findCommentLength,
  updatePostComment,
  deleteAllPostComment,
  updatePostPv,
  findPageById,
  findCommentByPage
};

//提取对象数组中对象的类型
declare type flatten<T> = T extends Array<infer item> ? item : T
//提取promise返回类型
declare type PromiseType<T> = T extends Promise<infer U> ? U : never;
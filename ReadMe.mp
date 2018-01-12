$console.log 'Markplus:', '{\n'                                                 // `$IDENT ...args` used to call the ident function with args
$console.log /1 /* `/N` will be replaced by next N lines after. */, '\n'
    Home: 'https://github.com/zhengxiaoyao0716/markplus',
$console.log/2, '\n'                                                            // if `/N` followed `IDENT` directly without white-space,
    '    Author:'                                                               // the execution result would be used instead of convert to string.
    "'github.com/zhengxiaoyao0716',\n}"
$_ /4                                                                           // equals to `$void /4`, nothing would execute but next N lines was gone.
======== ======== ======== ======== ======== ======== ======== ========         // not equals to `$_/N` (without white-space), the latter will execute the codes.
(^_^) Those block only visible in source to make things looks tidiness.
======== ======== ======== ======== ======== ======== ======== ========

#hitokoto(a, b, c) [a, b, c][parseInt(Math.random() * 3)]                       // `#IDENT(...args) ...results` used to define a function, `()` can be omitted if no arguments.
#_lang /3                                                                       // you could use `#IDENT(...args) /N` to define a function composed by mutli-line functions.
    location.search.match(/lang=(\w+)/)                                         // `()` was omitted, for no arguments needed.
    (match) console.log(match), ['en', 'zh', 'jp'].indexOf(match && match[1])   // although `...results` allowed, only the last result will return.
    (index) arguments[index == -1 ? 0 : index]
#lang/3                                                                         // `/N` followed `IDENT` directly without white-space,
    location.search.match(/lang=(\w+)/)                                         // the function defined below would be executed immediately.
    (match) ['en', 'zh', 'jp'].indexOf(match && match[1])
    (index) function () { return arguments[index == -1 ? 0 : index]; }          // the last return is a function, and this would be assigned to the `IDENT`.
#version/'v0.0.1'                                                               // `#IDENT/value` means `#IDENT/0 value`, you can use this to define constant.
$console.log(console, 'version:')/1                                             // `$IDENT(this, ...thisArgs) ...args` equals to `$IDENT.bind(this, ...thisArgs)(...Args)`.
    version                                                                     // for `/N` followed `$IDENT(...args)` directly, 'v0.0.1' was used, instead of 'version'.
$_/'equals to `$_/0 ...`'                                                       // notice that the `...args` will be execute for `/N` followed `IDENT` directly without white-space.
$_ /:120                                                                        // `/:n` = `/N` , N = n - 25
The codes above is equivalent to those:
``` javascript
    // L1
    console.log(
        'Markplus:', '{\n'                                                 // `$IDENT ...args` used to call the ident function with args
    );
    // L2
    console.log(
        "    Home: 'https://github.com/zhengxiaoyao0716/markplus'," /* `/N` will be replaced by next N lines after. */, '\n'
    );
    // L4
    _L5 = (
        '    Author:'                                                               // the execution result would be used instead of convert to string.
    )
    _L6 = (
        "'github.com/zhengxiaoyao0716',\n}"
    )
    console.log(
        _L5,
        _L6, '\n'                                                            // if `/N` followed `IDENT` directly without white-space,
    );
    // L7
    void(
        "======== ======== ======== ======== ======== ======== ======== ========         // not equals to `$_/N` (without white-space), the latter will execute the codes.",
        "(^_^) Those block only visible in source to make things looks tidiness.",
        "======== ======== ======== ======== ======== ======== ======== ========",
        ""                                                                           // equals to `$void /4`, nothing would execute but next N lines was gone.
    );

    // L12
    const hitokoto = function (
        a, b, c
    ) { return (
        [a, b, c][parseInt(Math.random() * 3)]                       // `#IDENT(...args) ...results` used to define a function, `()` can be omitted if no arguments.
    ); };
    // L13
    const lang = function () {
        let result;
        result = (() => (
            location.search.match(/lang=(\w+)/)                                         // `()` was omitted, for no arguments needed.
        ))(result);
        result = ((match) => (
            console.log(match), ['en', 'zh', 'jp'].indexOf(match && match[1])   // although `...results` allowed, only the last result will return.
        ))(result);
        result = ((index) => (
            arguments[index == -1 ? 0 : index];
        ))(result);
        return (
            result                                                                       // you could use `#IDENT(...args) /N` to define a function composed by mutli-line functions.
        );
    };
    // L17
    _lang = function () {
        let result;
        result = (() => (
            location.search.match(/lang=(\w+)/)                                         // the function defined below would be executed immediately.
        ))(result);
        result = ((match) => (
            ['en', 'zh', 'jp'].indexOf(match && match[1])
        ))(result);
        result = ((index) => (
            function () { return arguments[index == -1 ? 0 : index]; }          // the last return is a function, and this would be assigned to the `IDENT`.
        ))(result);
        return (
            result                                                                         // `/N` followed `IDENT` directly without parentheses-params and white-space
        );
    };
    const lang = _lang();
    // L21
    _version = function () { return (
        'v0.0.1'                                                               // `#IDENT/value` means `#IDENT/0 value`, you can use this to define constant.
    ); };
    const version = _version();
    // L22
    _L23 = (
        version                                                                     // for `/N` followed `$IDENT(...args)` directly, 'v0.0.1' was used, instead of 'version'
    );
    _L24 = (
        void(
            'equals to `$_/0 ...`'                                                       // notice that the `...args` will be execute for `/N` followed `IDENT` directly without white-space.
        )
    );
    console.log.bind(console, 'version:')(
        _L23,
        _L24                                             // `$IDENT(this, ...thisArgs) ...args` equals to `$IDENT.bind(this, ...thisArgs)(...Args)`.
    );

    // L25
    void(
        ",,,"                                                                        // `/:n` = `/N` , N = n - 25
    )
```



# Markplus
$lang/2
## The strengthening of the `Markdown`. (<a href='?lang=zh'>中文版？</a>)
## `Markdown` 的加强 (<a href='?lang=en'>English?</a>)

---
$lang/2
## Usage
## 用法
``` shell
markplus ReadMe.mp -h
```

---
$lang/2
## Base goal
## 基础目标
$lang/2
### More perfect tool chain.
### 更完善的工具链
$lang/2
Easy to embedded, Convenient extension.
易用，易扩展

$lang/2
### Strengthing for `Table` .
### 加强表格
$lang/2
Multi-unit-grid, Macro calculate.
混合单元格，宏计算

$lang/2
### Clearer semantics.
### 更清晰的语义
$lang/2
When to break line, When to scroll.
何时换行，何时滚动

$lang/2
### Dynamic interactivity.
### 动态交互
$lang/2
Optional\ configurable and safety dynamic perform.
可选、可配置并且安全的动态演出

$lang/2
### Reasonable structure.
### 合理的结构
$lang/2
Reusable, Inheritable.
可复用，可继承

$lang/2
### Flexible usage.
### 使用灵活
$lang/2
Precompiled\ Runtime-render.
预编译、运行时渲染

***
$lang/2
## But, All the premises: Keep Simple.
## 但是，一切的前提是：保持简单

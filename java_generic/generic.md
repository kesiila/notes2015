#####泛型
*. 23。集合的原生态类型是不安全的。
    ```
    Set s;
    s.add("1");
    s.add(1);
    String s = s.get(0);// ClassCastException
    ```
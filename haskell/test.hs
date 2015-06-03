module Main (f, g, teddy, post, f1,main)
where

f str =
    [ c | c <- str, c == 'x']

g str =
    [c | c <- reverse str, c < 'n']

teddy = "A man, a plan, a canal. Panama!"


post x y = x

f1 :: Num x => x -> x
f1 x =
    x + 2


main =
    do
        putStr "Please enter your name.\n"
        name <- getLine
        putStr("Thank you," ++ name ++ ".\n" ++
            "Have a nice day (:-)\n")


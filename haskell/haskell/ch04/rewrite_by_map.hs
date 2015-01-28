import Data.Char (toUpper)

square2 xs = map squareOne xs 
	where squareOne x = x * x
upperCase2 xs = map toUpper xs 

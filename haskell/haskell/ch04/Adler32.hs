import Data.Char (ord)
import Data (shiftL, (.&.), (.|.))

base = 65521

adler32 xs = helper 1 0 xs 
	where helper a b (x:xs) = let a' = (a + (ord x .&. 0xff)) 'mod' base 
				b' = (a' + b) 'mod' base 
				in helper a' b' xs 
		helper a b [] = (b 'shiftL' 16) .|. a 

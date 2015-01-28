mySum xs = helper 0 xs 
	where helper acc (x:sx) = helper (acc + x ) xs
		helper acc [] = acc


--file: ch03/BookStore.hs 
type CardHolder = String 
type CardNumber = String
type CustomerID = String
type Address = [String]
data BillingInfo = CreditCard CardNumber CardHolder Address
		| CashOnDelivery
		| Invoice  CustomerID
		  deriving (Show) 

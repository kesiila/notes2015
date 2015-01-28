--file: ch03/BookStore.hs

type BookRecord = (BookInfo, BookReview)
type CustomerId = Int
type ReviewBody = String

data BetterReview = BetterReview BookInfo CustomerId ReviewBody


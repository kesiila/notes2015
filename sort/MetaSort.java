package sort;

import java.util.List;
import sort.*;
public interface MetaSort extends ReadTestDataFromFile , PrintData {
   public List<Object> coreSort(List<Object> rawData);
   public default void sort() {
       print(coreSrot(readData()));
   }
}
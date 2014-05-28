package j15r.bench2d;

import com.google.gwt.core.client.EntryPoint;

public class GwtBench2d extends Bench2d implements EntryPoint {

  @Override
  public void onModuleLoad() {
    warmup();
    float[] results  = bench();
    printResults(results[0], results[1], results[2]);
  }

  native void printResults(float mean, float r5, float r95) /*-{
    alert("Mean: " + mean + ", 5th: " + r5 + ", 95th: " + r95);
  }-*/;


  @Override
  native void log(String msg) /*-{
//    console.log(msg);
  }-*/;
}

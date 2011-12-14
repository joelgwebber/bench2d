package j15r.bench2d;

import com.google.gwt.core.client.EntryPoint;

public class GwtBench2d extends Bench2d implements EntryPoint {

  @Override
  public void onModuleLoad() {
    warmup();
    bench();
  }

  @Override
  native void log(String msg) /*-{
    console.log(msg);
  }-*/;
}

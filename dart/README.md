## Setup

* [Install Dart](https://www.dartlang.org/tools/download.html)
* Make sure Dart executables are on your path: `dart` and `pub`
* Run `pub upgrade`.

## Running the Dart benchmark

```
$ dart bin/bench2d_exe.dart
```

## Running the benchmark compiled to Javascript

### Using a browser

```
$ pub serve
```

* See see the output in your browser: http://localhost:8080/bench2d_web.html
* Run the benchmark in your browser without UI: https://stackedit.io/editor
  * *Open the developer tools to see the benchmark results printed to the console.*

### Using node.

You can run the javascript directly using `node`.

```
$ node build/web/bench2d.dart.js
```

##Building the benchmark code

```
$ pub build
```

This will update the contents of the `build/web` directory.

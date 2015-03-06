# JSX Control

A JSTransform that adds syntactical sugar that turns <If> and <For> elements into control statements.

## Usage

## If

```
<If condition={this.props.banner}>
  <Banner />
 </If>
```

turns into...

```
{function() {
  if (this.props.banner) {
    return (<Banner />)
  }
}.call(this)}
```

The <If> body must return a single JSX root element. You can even nest!

```
<If condition={this.props.banner}>
  <div className="banner">
    <Banner />
    <If condition={this.props.user && this.props.user.avatar}>
      <Picture avatar={this.props.user.avatar} />
    </If>
  </div>
</If>
```


## For Tag

```
<For each="fruit" of={this.props.fruits}>
  <li key={fruit}>{fruit}</li>
</For>
```

this becomes

```
this.props.fruits.map(function(fruit) { return (
  <li key={fruit}>{fruit}</li>
)}, this)
```

## Installation

```
  npm install jsx-control
```

### Webpack
A visitorList is available through ``jsx-control/visitors```, which can be used in conjunction with [JSTransform Loader](https://github.com/conradz/jstransform-loader).

### Browserify
Include 'jsx-control/browserify'

### node-jsx
The transform can be added during the install function of node-jsx

```
var jsxControl = require('jsx-control');
require('node-jsx').install({
  extension: '.jsx',
  additionalTransform: function(src) {
    return jsxControl(src);
  }
});
```

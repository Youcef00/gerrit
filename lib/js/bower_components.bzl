# DO NOT EDIT
# generated with the following command:
#
#   tools/js/bower2bazel.py -w lib/js/bower_archives.bzl -b lib/js/bower_components.bzl
#

load("//tools/bzl:js.bzl", "bower_component")
def define_bower_components():
  bower_component(
    name = "es6-promise",
    license = "//lib:LICENSE-polymer",
    seed = True,
  )
  bower_component(
    name = "fetch",
    license = "//lib:LICENSE-fetch",
    seed = True,
  )
  bower_component(
    name = "iron-a11y-announcer",
    license = "//lib:LICENSE-polymer",
    deps = [ ":polymer" ],
  )
  bower_component(
    name = "iron-a11y-keys-behavior",
    license = "//lib:LICENSE-polymer",
    deps = [ ":polymer" ],
  )
  bower_component(
    name = "iron-autogrow-textarea",
    license = "//lib:LICENSE-polymer",
    deps = [
      ":iron-behaviors",
      ":iron-flex-layout",
      ":iron-form-element-behavior",
      ":iron-validatable-behavior",
      ":polymer",
    ],
    seed = True,
  )
  bower_component(
    name = "iron-behaviors",
    license = "//lib:LICENSE-polymer",
    deps = [
      ":iron-a11y-keys-behavior",
      ":polymer",
    ],
  )
  bower_component(
    name = "iron-dropdown",
    license = "//lib:LICENSE-polymer",
    deps = [
      ":iron-a11y-keys-behavior",
      ":iron-behaviors",
      ":iron-overlay-behavior",
      ":iron-resizable-behavior",
      ":neon-animation",
      ":polymer",
    ],
    seed = True,
  )
  bower_component(
    name = "iron-fit-behavior",
    license = "//lib:LICENSE-polymer",
    deps = [ ":polymer" ],
  )
  bower_component(
    name = "iron-flex-layout",
    license = "//lib:LICENSE-polymer",
    deps = [ ":polymer" ],
  )
  bower_component(
    name = "iron-form-element-behavior",
    license = "//lib:LICENSE-polymer",
    deps = [ ":polymer" ],
  )
  bower_component(
    name = "iron-input",
    license = "//lib:LICENSE-polymer",
    deps = [
      ":iron-a11y-announcer",
      ":iron-validatable-behavior",
      ":polymer",
    ],
    seed = True,
  )
  bower_component(
    name = "iron-meta",
    license = "//lib:LICENSE-polymer",
    deps = [ ":polymer" ],
  )
  bower_component(
    name = "iron-overlay-behavior",
    license = "//lib:LICENSE-polymer",
    deps = [
      ":iron-a11y-keys-behavior",
      ":iron-fit-behavior",
      ":iron-resizable-behavior",
      ":polymer",
    ],
    seed = True,
  )
  bower_component(
    name = "iron-resizable-behavior",
    license = "//lib:LICENSE-polymer",
    deps = [ ":polymer" ],
  )
  bower_component(
    name = "iron-selector",
    license = "//lib:LICENSE-polymer",
    deps = [ ":polymer" ],
    seed = True,
  )
  bower_component(
    name = "iron-validatable-behavior",
    license = "//lib:LICENSE-polymer",
    deps = [
      ":iron-meta",
      ":polymer",
    ],
  )
  bower_component(
    name = "moment",
    license = "//lib:LICENSE-moment",
    seed = True,
  )
  bower_component(
    name = "neon-animation",
    license = "//lib:LICENSE-polymer",
    deps = [
      ":iron-meta",
      ":iron-resizable-behavior",
      ":iron-selector",
      ":polymer",
      ":web-animations-js",
    ],
  )
  bower_component(
    name = "page",
    license = "//lib:LICENSE-polymer",
    seed = True,
  )
  bower_component(
    name = "polymer",
    license = "//lib:LICENSE-polymer",
    deps = [ ":webcomponentsjs" ],
    seed = True,
  )
  bower_component(
    name = "promise-polyfill",
    license = "//lib:LICENSE-polymer",
    deps = [ ":polymer" ],
    seed = True,
  )
  bower_component(
    name = "web-animations-js",
    license = "//lib:LICENSE-Apache2.0",
  )
  bower_component(
    name = "webcomponentsjs",
    license = "//lib:LICENSE-polymer",
  )

'use strict';

import { builders as b } from '@glimmer/syntax';
import processTemplate from '../helpers/process-template';
import { appendToContent } from '../../lib';

describe('Helper #appendToContent', function() {
  it('it can append regular strings', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent('bar', attr.value);
        attr.value = appendToContent('baz', attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).toEqual(`<div class="foo bar baz"></div>`);
  });

  it('it can append StringLiterals', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b.string('bar'), attr.value);
        attr.value = appendToContent(b.string('baz'), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).toEqual(`<div class="foo bar baz"></div>`);
  });

  it('it can append NumberLiterals', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b.number(1), attr.value);
        attr.value = appendToContent(b.number(2), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).toEqual(`<div class="foo 1 2"></div>`);
  });

  it('it can append TextNodes to another TextNode', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b.text('bar'), attr.value);
        attr.value = appendToContent(b.text('baz'), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).toEqual(`<div class="foo bar baz"></div>`);
  });

  it('it can append PathExpression', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b.path('bar'), attr.value);
        attr.value = appendToContent(b.path('baz'), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).toEqual(`<div class="foo {{bar}} {{baz}}"></div>`);
  });

  it('it can append MustacheStatement', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b.mustache(b.path('bar')), attr.value);
        attr.value = appendToContent(b.mustache(b.path('baz')), attr.value);
        attr.value = appendToContent(b.mustache(b.path('if'), [b.path('condition'), b.string('yes'), b.string('no')]), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).toEqual(`<div class="foo {{bar}} {{baz}} {{if condition "yes" "no"}}"></div>`);
  });

  it('it can append SubExpressions', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b.sexpr(b.path('some-helper'), [b.string('someArg')]), attr.value);
        attr.value = appendToContent(b.sexpr(b.path('if'), [b.path('condition'), b.string('yes'), b.string('no')]), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).toEqual(`<div class="foo {{some-helper "someArg"}} {{if condition "yes" "no"}}"></div>`);
  });

  it('it can mix and append a mix of elements', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b.mustache(b.path('one')), b.text(''));
        attr.value = appendToContent(b.mustache(b.path('two')), attr.value);
        attr.value = appendToContent(b.text('three'), attr.value);
        attr.value = appendToContent('four', attr.value);
        attr.value = appendToContent(b.path('five'), attr.value);
        attr.value = appendToContent(b.mustache(b.path('if'), [b.path('condition'), b.string('yes'), b.string('no')]), attr.value);
        attr.value = appendToContent(b.path('six'), attr.value);
        return attr;
      }
    });

    expect(modifiedTemplate).toEqual(`<div class="{{one}} {{two}} three four {{five}} {{if condition "yes" "no"}} {{six}}"></div>`);
  });

  it('it can mix and append a mix of elements without prepending spaces', function() {
    let modifiedTemplate = processTemplate(`<div class="foo"></div>`, {
      AttrNode(attr) {
        attr.value = appendToContent(b.mustache(b.path('one')), b.text(''), { prependSpace: false });
        attr.value = appendToContent(b.mustache(b.path('two')), attr.value, { prependSpace: false });
        attr.value = appendToContent(b.text('three'), attr.value, { prependSpace: false });
        attr.value = appendToContent('four', attr.value, { prependSpace: false });
        attr.value = appendToContent(b.path('five'), attr.value, { prependSpace: false });
        attr.value = appendToContent(b.mustache(b.path('if'), [b.path('condition'), b.string('yes'), b.string('no')]), attr.value, { prependSpace: false });
        attr.value = appendToContent(b.path('six'), attr.value, { prependSpace: false });
        return attr;
      }
    });

    expect(modifiedTemplate).toEqual(`<div class="{{one}}{{two}}threefour{{five}}{{if condition "yes" "no"}}{{six}}"></div>`);
  });
});
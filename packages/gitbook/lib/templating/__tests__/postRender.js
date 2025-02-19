var TemplateEngine = require('../../models/templateEngine');
var TemplateBlock = require('../../models/templateBlock');

var renderTemplate = require('../render');
var postRender = require('../postRender');

describe('postRender', () => {
    var testPost;
    var engine = TemplateEngine.create({
        blocks: [
            TemplateBlock.create('lower', function(blk) {
                return blk.body.toLowerCase();
            }),
            TemplateBlock.create('prefix', function(blk) {
                return {
                    body: '_' + blk.body + '_',
                    post: function() {
                        testPost = true;
                    }
                };
            })
        ]
    });

    test('should correctly replace block', () => {
        return renderTemplate(engine, 'README.md', 'Hello {% lower %}Samy{% endlower %}')
            .then(function(output) {
                expect(output.getContent()).toMatch(/Hello \{\{\-([\S]+)\-\}\}/);
                expect(output.getBlocks().size).toBe(1);

                return postRender(engine, output);
            })
            .then(function(result) {
                expect(result).toBe('Hello samy');
            });
    });

    test('should correctly replace blocks', () => {
        return renderTemplate(engine, 'README.md', 'Hello {% lower %}Samy{% endlower %}{% prefix %}Pesse{% endprefix %}')
            .then(function(output) {
                expect(output.getContent()).toMatch(/Hello \{\{\-([\S]+)\-\}\}\{\{\-([\S]+)\-\}\}/);
                expect(output.getBlocks().size).toBe(2);
                return postRender(engine, output);
            })
            .then(function(result) {
                expect(result).toBe('Hello samy_Pesse_');
                expect(testPost).toBe(true);
            });
    });

});

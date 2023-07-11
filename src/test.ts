/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {HTMLParser, TokenScanner} from "./index";
import {ParserStream} from "./stream";

//describe('ParserStream', () => {
///	const stream = new ParserStream("ABCDEF");
//	expect(stream.skip("ABC")).toBeTruthy();
//	expect(stream.skip("DEF")).toBeTruthy();
//})


describe('HTMLParser', () => {

	/*
	class TestBaseParser extends HTMLParser {

		public parse_s(): boolean {
			return super.parse_s();
		}

		public parse_number(): boolean {
			return super.parse_number();
		}

		public parse_alphabets(): boolean {
			return super.parse_alphabets();
		}

		public attr_single_quoted_value(): boolean {
			return super.attr_single_quoted_value();
		}

		public attr_double_quoted_value(): boolean {
			return super.attr_double_quoted_value();
		}

		public attr_single_quoted(): boolean {
			return super.attr_single_quoted();
		}

		public attr_double_quoted(): boolean {
			return super.attr_double_quoted();
		}

		public attr_name(): boolean {
			return super.attr_name();
		}

		public attr(): boolean {
			return super.attr();
		}

		public attr_list(): boolean {
			return super.attr_list();
		}

		public tag_close(): boolean {
			return super.tag_close();
		}

		public tag_empty(): boolean {
			return super.tag_empty();
		}

	}


	it('BaseParser', () => {
		const scanner = new TestBaseParser(null, new ParserStream(" 1a000"));
		expect(scanner.parse_s()).toBeTruthy();
		expect(scanner.parse_number()).toBeTruthy();
		expect(scanner.parse_alphabets()).toBeTruthy();
		expect(scanner.parse_number()).toBeTruthy();
		expect(scanner.parse_number()).toBeFalsy();

	});

	it('HTMLParser', () => {
		const scanner = new TestBaseParser(null, new ParserStream("'01$aaaa'"));
		expect(scanner.attr_single_quoted_value()).toBeTruthy();
		expect(scanner.attr_double_quoted_value()).toBeFalsy();

		const scanner2 = new TestBaseParser(null, new ParserStream('"01$aaaa"'));
		expect(scanner2.attr_single_quoted_value()).toBeFalsy();
		expect(scanner2.attr_double_quoted_value()).toBeTruthy();

		const scanner3 = new TestBaseParser(null, new ParserStream('""'));
		expect(scanner3.attr_single_quoted_value()).toBeFalsy();
		expect(scanner3.attr_double_quoted_value()).toBeTruthy();

		const scanner4 = new TestBaseParser(null, new ParserStream("''"));
		expect(scanner4.attr_single_quoted_value()).toBeTruthy();
		expect(scanner4.attr_double_quoted_value()).toBeFalsy();

		const scanner71 = new TestBaseParser(null, new ParserStream('A'));
		expect(scanner71.attr_name()).toBeTruthy();

		const scanner5 = new TestBaseParser(null, new ParserStream("A=''"));
		expect(scanner5.attr_single_quoted()).toBeTruthy();
		expect(scanner5.attr_single_quoted()).toBeFalsy();

		const scanner6 = new TestBaseParser(null, new ParserStream('A=""'));
		expect(scanner6.attr_double_quoted()).toBeTruthy();
		expect(scanner6.attr_double_quoted()).toBeFalsy();



		const scanner7 = new TestBaseParser(null, new ParserStream('A="aaaa"'));
		expect(scanner7.attr()).toBeTruthy();

		const scanner8 = new TestBaseParser(null, new ParserStream("A='bbbb'"));
		expect(scanner8.attr()).toBeTruthy();




		const scanner9 = new TestBaseParser(null, new ParserStream('A'));
		expect(scanner9.attr()).toBeTruthy();
		const scanner10 = new TestBaseParser(null, new ParserStream('A=""'));
		expect(scanner10.attr()).toBeTruthy();

		const scanner11 = new TestBaseParser(null, new ParserStream(' A=""'));
		expect(scanner11.attr_list()).toBeTruthy();
		const scanner12 = new TestBaseParser(null, new ParserStream(' hoge="1"'));
		expect(scanner12.attr_list()).toBeTruthy();

	//    const scanner15 = new TestBaseParser(null, new ParserStream(''));
	//    expect(scanner15.attr_list()).toBeTruthy();

		const scanner13 = new TestBaseParser(null, new ParserStream('</hoge>'));
		expect(scanner13.tag_close()).toBeTruthy();

		const scanner14 = new TestBaseParser(null, new ParserStream('<aaaa x="1" />'));
		expect(scanner14.tag_empty()).toBeTruthy();

	});

*/

	it('empty',
		() => {
			try {
				let parser = new HTMLParser(null, new ParserStream(""));
				expect(parser.char_is("a")).toBeTruthy();
			} catch (e: any) {
				expect(true).toBeTruthy();
			}
		}
	)

	it('range1', () => {
		let parser = new HTMLParser(null, new ParserStream(" !\"#$%&'()*+,-./"));
		expect(parser.range(0x0020, 0x0020)).toBeTruthy();
		expect(parser.range(0x0021, 0x0021)).toBeTruthy();
		expect(parser.range(0x0022, 0x0022)).toBeTruthy();
		expect(parser.range(0x0023, 0x0023)).toBeTruthy();
		expect(parser.range(0x0024, 0x0024)).toBeTruthy();
		expect(parser.range(0x0025, 0x0025)).toBeTruthy();
		expect(parser.range(0x0026, 0x0026)).toBeTruthy();
		expect(parser.range(0x0027, 0x0027)).toBeTruthy();
		expect(parser.range(0x0028, 0x0028)).toBeTruthy();
		expect(parser.range(0x0029, 0x0029)).toBeTruthy();
		expect(parser.range(0x002a, 0x002a)).toBeTruthy();
		expect(parser.range(0x002b, 0x002b)).toBeTruthy();
		expect(parser.range(0x002c, 0x002c)).toBeTruthy();
		expect(parser.range(0x002d, 0x002d)).toBeTruthy();
		expect(parser.range(0x002e, 0x002e)).toBeTruthy();
		expect(parser.range(0x002f, 0x002f)).toBeTruthy();
	});

	it('range2', () => {
		let parser = new HTMLParser(null, new ParserStream(" !\"#$%&'()*+,-./"));
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
		expect(parser.range(0x0020, 0x002f)).toBeTruthy();
	});

	it('range3', () => {
		let parser = new HTMLParser(null, new ParserStream("    "));
		expect(parser.range(0x001f, 0x0020)).toBeTruthy();
		expect(parser.range(0x0020, 0x0021)).toBeTruthy();
		expect(parser.range(0x001f, 0x001f)).toBeFalsy();
		expect(parser.range(0x0021, 0x0021)).toBeFalsy();
	});

	it('char_is', () => {
		let parser = new HTMLParser(null, new ParserStream("A "));
		expect(parser.char_is("A")).toBeTruthy();
		expect(parser.char_is("A")).toBeFalsy();
	});

	it('code_is', () => {
		let parser = new HTMLParser(null, new ParserStream("AA"));
		expect(parser.code_is(0x41)).toBeTruthy();
		expect(parser.code_is(0x42)).toBeFalsy();
	});

	it('is_not', () => {
		let parser = new HTMLParser(null, new ParserStream("ABCDE"));
		expect(parser.is_not([])).toBeTruthy();
		expect(parser.is_not(["A"])).toBeFalsy();
		expect(parser.is_not(["BC", "CD"])).toBeFalsy();
	});


	it('serial', () => {
		let parser = new HTMLParser(null, new ParserStream("ABC"));
		expect(parser.serial([
			() => {return parser.code_is(0x41)},
			() => {return parser.code_is(0x42)},
			() => {return parser.code_is(0x43)}])).toBeTruthy();
	});

	it('skip', () => {
		let parser = new HTMLParser(null, new ParserStream("ABCDEFGHIJK"));
		expect(parser.serial(
			[
				() => {return parser.commit(() => {return parser.skip("ABCD")})},
				() => {return parser.commit(() => {return parser.skip("EFGH")})}
			]
		)).toBeTruthy();

	});

	it('select', () => {
		let parser = new HTMLParser(null, new ParserStream("A"));
		expect(parser.select([　() => {return parser.code_is(0x41)}, () => {return parser.code_is(0x42)}, () => {return parser.code_is(0x43)}])).toBeTruthy();
		parser = new HTMLParser(null, new ParserStream("B"));
		expect(parser.select([　() => {return parser.code_is(0x41)}, () => {return parser.code_is(0x42)}, () => {return parser.code_is(0x43)}])).toBeTruthy();
		parser = new HTMLParser(null, new ParserStream("C"));
		expect(parser.select([　() => {return parser.code_is(0x41)}, () => {return parser.code_is(0x42)}, () => {return parser.code_is(0x43)}])).toBeTruthy();
		parser = new HTMLParser(null, new ParserStream("D"));
		expect(parser.select([　() => {return parser.code_is(0x41)}, () => {return parser.code_is(0x42)}, () => {return parser.code_is(0x43)}])).toBeFalsy();
	});

	it('repeat0', () => {
		let parser = new HTMLParser(null, new ParserStream("AAAAAB"));
		expect(parser.repeat0(() => {return parser.code_is(0x41)})).toBeTruthy();
		expect(parser.code_is(0x42)).toBeTruthy();

	});

	it('repeat1', () => {
		let parser = new HTMLParser(null, new ParserStream("AAAABBBBCCCCC"));
		expect(parser.repeat0(() => {return parser.code_is(0x41)})).toBeTruthy();
		expect(parser.code_is(0x42)).toBeTruthy();
		expect(parser.repeat0(() => {return parser.code_is(0x43)})).toBeTruthy();
	});

	it('is_Eq', () => {
		let parser = new HTMLParser(null, new ParserStream(" = "));
		expect(parser.is_Eq()).toBeTruthy();
		parser = new HTMLParser(null, new ParserStream("= "));
		expect(parser.is_Eq()).toBeTruthy();
		parser = new HTMLParser(null, new ParserStream(" ="));
		expect(parser.is_Eq()).toBeTruthy();
		parser = new HTMLParser(null, new ParserStream("="));
		expect(parser.is_Eq()).toBeTruthy();
	});

	it( "comment",() => {
		//	'<!--' ((Char - '-') | ('-' (Char - '-')))* '-->'
		expect(new HTMLParser(null, new ParserStream("<!-- -->")).is_Comment()).toBeTruthy();
	})

	it('all', () => {

		//	prolog element Misc*
		//expect(new HTMLParser(null, new ParserStream("")).is_document()).toBeTruthy();

		// #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
		expect(new HTMLParser(null, new ParserStream(" ")).is_Char()).toBeTruthy();

		expect(new HTMLParser(null, new ParserStream("-")).is_Char()).toBeTruthy();
		expect(new HTMLParser(null, new ParserStream(" ")).is_Char()).toBeTruthy();

		//(#x20 | #x9 | #xD | #xA)+
		expect(new HTMLParser(null, new ParserStream("")).is_S()).toBeTruthy();

		// ":"| [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
		expect(new HTMLParser(null, new ParserStream("A")).is_NameStartChar()).toBeTruthy();

		//	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
		expect(new HTMLParser(null, new ParserStream("A")).is_NameChar()).toBeTruthy();

		//	NameStartChar (NameChar)*
		expect(new HTMLParser(null, new ParserStream("AAAA")).is_Name()).toBeTruthy();

		//  Name  (#x20 Name)*
		expect(new HTMLParser(null, new ParserStream("")).is_Names()).toBeTruthy();

		//	(NameChar)+
		expect(new HTMLParser(null, new ParserStream("AAAA")).is_Nmtoken()).toBeTruthy();

		//	Nmtoken (#x20 Nmtoken)*
		expect(new HTMLParser(null, new ParserStream("")).is_Nmtokens()).toBeTruthy();

		//	'"' ([^%&"] | PEReference | Reference)* '"' |  "'" ([^%&'] | PEReference | Reference)* "'"
		expect(new HTMLParser(null, new ParserStream('"%HOGE;"')).is_EntityValue()).toBeTruthy();

		//	'"' ([^<&"] | Reference)* '"' |  "'" ([^<&'] | Reference)* "'"
		expect(new HTMLParser(null, new ParserStream("'&HOGE;'")).is_AttValue()).toBeTruthy();

		//	('"' [^"]* '"') | ("'" [^']* "'")
		expect(new HTMLParser(null, new ParserStream("''")).is_SystemLiteral()).toBeTruthy();

		//	'"' PubidChar* '"' | "'" (PubidChar - "'")* "'"
		expect(new HTMLParser(null, new ParserStream("' '")).is_PubidLiteral()).toBeTruthy();

		// #x20 | #xD | #xA | [a-zA-Z0-9] | [-'()+,./:=?;!*#@$_%]
		expect(new HTMLParser(null, new ParserStream(" ")).is_PubidChar()).toBeTruthy();

		// #x20 | #xD | #xA | [a-zA-Z0-9] | [-()+,./:=?;!*#@$_%]
		expect(new HTMLParser(null, new ParserStream(" ")).is_PubidChar2()).toBeTruthy();

		//	'<!--' ((Char - '-') | ('-' (Char - '-')))* '-->'
		expect(new HTMLParser(null, new ParserStream("<!-- -->")).is_Comment()).toBeTruthy();

		expect(new HTMLParser(null, new ParserStream("")).is_PI()).toBeTruthy();

		//	CDStart CData CDEnd
		expect(new HTMLParser(null, new ParserStream("")).is_CDSect()).toBeTruthy();

		//	'<![CDATA['
		expect(new HTMLParser(null, new ParserStream("")).is_CDStart()).toBeTruthy();

		//	']]>'
		expect(new HTMLParser(null, new ParserStream("")).is_CDEnd()).toBeTruthy();

		//	XMLDecl? Misc* (doctypedecl Misc*)?
		expect(new HTMLParser(null, new ParserStream("")).is_prolog()).toBeTruthy();

		//	'<?xml' VersionInfo EncodingDecl? SDDecl? S? '?>'
		expect(new HTMLParser(null, new ParserStream("")).is_XMLDecl()).toBeTruthy();

		//	S 'version' Eq ("'" VersionNum "'" | '"' VersionNum '"')
		expect(new HTMLParser(null, new ParserStream("")).is_VersionInfo()).toBeTruthy();

		//	S? '=' S?
		expect(new HTMLParser(null, new ParserStream("")).is_Eq()).toBeTruthy();

		//	'1.' [0-9]+
		expect(new HTMLParser(null, new ParserStream("")).is_VersionNum()).toBeTruthy();

		//	Comment | PI | S
		expect(new HTMLParser(null, new ParserStream("")).is_Misc()).toBeTruthy();

		//	'<!DOCTYPE' S Name (S ExternalID)? S? ('[' intSubset ']' S?)? '>'
		expect(new HTMLParser(null, new ParserStream("")).is_doctypedecl()).toBeTruthy();

		//	PEReference | S
		expect(new HTMLParser(null, new ParserStream("")).is_DeclSep()).toBeTruthy();

		//	(markupdecl | DeclSep)*
		expect(new HTMLParser(null, new ParserStream("")).is_intSubset()).toBeTruthy();

		//	elementdecl | AttlistDecl | EntityDecl | NotationDecl | PI | Comment
		expect(new HTMLParser(null, new ParserStream("")).is_markupdecl()).toBeTruthy();

		//	TextDecl? extSubsetDecl
		expect(new HTMLParser(null, new ParserStream("")).is_extSubset()).toBeTruthy();

		//	( markupdecl | conditionalSect | DeclSep)*
		expect(new HTMLParser(null, new ParserStream("")).is_extSubsetDecl()).toBeTruthy();

		//	S 'standalone' Eq (("'" ('yes' | 'no') "'") | ('"' ('yes' | 'no') '"'))
		expect(new HTMLParser(null, new ParserStream("")).is_SDDecl()).toBeTruthy();

		//	EmptyElemTag | STag content ETag
		expect(new HTMLParser(null, new ParserStream("")).is_element()).toBeTruthy();

		//	'<' Name (S Attribute)* S? '>'
		expect(new HTMLParser(null, new ParserStream("")).is_STag()).toBeTruthy();

		//	Name Eq AttValue
		expect(new HTMLParser(null, new ParserStream("")).is_Attribute()).toBeTruthy();

		//	'</' Name S? '>'
		expect(new HTMLParser(null, new ParserStream("")).is_ETag()).toBeTruthy();

		//	CharData? ((element | Reference | CDSect | PI | Comment) CharData?)*
		expect(new HTMLParser(null, new ParserStream("")).is_content()).toBeTruthy();

		//	'<' Name (S Attribute)* S? '/>'
		expect(new HTMLParser(null, new ParserStream("")).is_EmptyElemTag()).toBeTruthy();

		//	'<!ELEMENT' S Name S contentspec S? '>'
		expect(new HTMLParser(null, new ParserStream("")).is_elementdecl()).toBeTruthy();

		//	'EMPTY' | 'ANY' | Mixed | children
		expect(new HTMLParser(null, new ParserStream("")).is_contentspec()).toBeTruthy();

		//	(choice | seq) ('?' | '*' | '+')?
		expect(new HTMLParser(null, new ParserStream("")).is_children()).toBeTruthy();

		//	(Name | choice | seq) ('?' | '*' | '+')?
		expect(new HTMLParser(null, new ParserStream("")).is_cp()).toBeTruthy();

		//	'(' S? cp ( S? '|' S? cp )+ S? ')'
		expect(new HTMLParser(null, new ParserStream("")).is_choice()).toBeTruthy();

		//	'(' S? cp ( S? ',' S? cp )* S? ')'
		expect(new HTMLParser(null, new ParserStream("")).is_seq()).toBeTruthy();

		//	'(' S? '#PCDATA' (S? '|' S? Name)* S? ')*' | '(' S? '#PCDATA' S? ')'
		expect(new HTMLParser(null, new ParserStream("")).is_Mixed()).toBeTruthy();

		//	'<!ATTLIST' S Name AttDef* S? '>'
		expect(new HTMLParser(null, new ParserStream("")).is_AttlistDecl()).toBeTruthy();

		//	S Name S AttType S DefaultDecl
		expect(new HTMLParser(null, new ParserStream("")).is_AttDef()).toBeTruthy();

		//	StringType | TokenizedType | EnumeratedType
		expect(new HTMLParser(null, new ParserStream("")).is_AttType()).toBeTruthy();

		//	'CDATA'
		expect(new HTMLParser(null, new ParserStream("")).is_StringType()).toBeTruthy();

		//	'ID' | 'IDREF' | 'IDREFS' | 'ENTITY' | 'ENTITIES' | 'NMTOKEN' | 'NMTOKENS'
		expect(new HTMLParser(null, new ParserStream("")).is_TokenizedType()).toBeTruthy();

		//	NotationType | Enumeration
		expect(new HTMLParser(null, new ParserStream("")).is_EnumeratedType()).toBeTruthy();

		//	'NOTATION' S '(' S? Name (S? '|' S? Name)* S? ')'
		expect(new HTMLParser(null, new ParserStream("")).is_NotationType()).toBeTruthy();

		//	'(' S? Nmtoken (S? '|' S? Nmtoken)* S? ')'
		expect(new HTMLParser(null, new ParserStream("")).is_Enumeration()).toBeTruthy();

		//	'#REQUIRED' | '#IMPLIED'| (('#FIXED' S)? AttValue)
		expect(new HTMLParser(null, new ParserStream("")).is_DefaultDecl()).toBeTruthy();

		//	includeSect | ignoreSect
		expect(new HTMLParser(null, new ParserStream("")).is_conditionalSect()).toBeTruthy();

		//	'<![' S? 'INCLUDE' S? '[' extSubsetDecl ']]>'
		expect(new HTMLParser(null, new ParserStream("")).is_includeSect()).toBeTruthy();

		//	'<![' S? 'IGNORE' S? '[' ignoreSectContents* ']]>'
		expect(new HTMLParser(null, new ParserStream("")).is_ignoreSect()).toBeTruthy();

		//	Ignore ('<![' ignoreSectContents ']]>' Ignore)*
		expect(new HTMLParser(null, new ParserStream("")).is_ignoreSectContents()).toBeTruthy();

/*

	public is_PI(): boolean {
 		// :todo -

	public is_PITarget(): boolean {
		// :todo -

	public is_CData(): boolean {
		// :todo -

	public is_Ignore(): boolean {
		// :todo -

*/
		//	'&#' [0-9]+ ';' | '&#x' [0-9a-fA-F]+ ';'
		expect(new HTMLParser(null, new ParserStream("")).is_CharRef()).toBeTruthy();

		//	EntityRef | CharRef
		expect(new HTMLParser(null, new ParserStream("")).is_Reference()).toBeTruthy();

		//	'&' Name ';'
		expect(new HTMLParser(null, new ParserStream("")).is_EntityRef()).toBeTruthy();

		//	'%' Name ';'
		expect(new HTMLParser(null, new ParserStream("")).is_PEReference()).toBeTruthy();

		//	GEDecl | PEDecl
		expect(new HTMLParser(null, new ParserStream("")).is_EntityDecl()).toBeTruthy();

		//	'<!ENTITY' S Name S EntityDef S? '>'
		expect(new HTMLParser(null, new ParserStream("")).is_GEDecl()).toBeTruthy();

		//	'<!ENTITY' S '%' S Name S PEDef S? '>'
		expect(new HTMLParser(null, new ParserStream("")).is_PEDecl()).toBeTruthy();

		//	EntityValue | (ExternalID NDataDecl?)
		expect(new HTMLParser(null, new ParserStream("")).is_EntityDef()).toBeTruthy();

		//	EntityValue | ExternalID
		expect(new HTMLParser(null, new ParserStream("")).is_PEDef()).toBeTruthy();

		//	'SYSTEM' S SystemLiteral | 'PUBLIC' S PubidLiteral S SystemLiteral
		expect(new HTMLParser(null, new ParserStream("")).is_ExternalID()).toBeTruthy();

		//	S 'NDATA' S Name
		expect(new HTMLParser(null, new ParserStream("")).is_NDataDecl()).toBeTruthy();

		//	'<?xml' VersionInfo? EncodingDecl S? '?>'
		expect(new HTMLParser(null, new ParserStream("")).is_TextDecl()).toBeTruthy();

		//	S 'encoding' Eq ('"' EncName '"' | "'" EncName "'" )
		expect(new HTMLParser(null, new ParserStream("")).is_EncodingDecl()).toBeTruthy();

		//	[A-Za-z]
		expect(new HTMLParser(null, new ParserStream("")).is_EncName()).toBeTruthy();

		//	'<!NOTATION' S Name S (ExternalID | PublicID) S? '>'
		expect(new HTMLParser(null, new ParserStream("")).is_NotationDecl()).toBeTruthy();

		//	'PUBLIC' S PubidLiteral
		expect(new HTMLParser(null, new ParserStream("")).is_PublicID()).toBeTruthy();

		//	BaseChar | Ideographic
		expect(new HTMLParser(null, new ParserStream("")).is_Letter()).toBeTruthy();

		expect(new HTMLParser(null, new ParserStream("")).is_BaseChar()).toBeTruthy();

		expect(new HTMLParser(null, new ParserStream("")).is_Ideographic()).toBeTruthy();

		expect(new HTMLParser(null, new ParserStream("")).is_CombiningChar()).toBeTruthy();

		expect(new HTMLParser(null, new ParserStream("")).is_Digit()).toBeTruthy();

		expect(new HTMLParser(null, new ParserStream("")).is_Extender()).toBeTruthy();

	})

});

/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {ParserStream} from './stream';


///////////////////////////////


export class TokenScanner {

	public stream: ParserStream;

	/**
	 *
	 * @remarks
	 */
	constructor(handler: null, stream: ParserStream) {
		this.stream = stream;
	}

	public char_is(v: any): boolean {
		let result: boolean = false;
		const char: string = this.stream.char;
		if (char === v) {
			result = true;
			this.stream.next();
		}
		return result;
	}

	public scan(v: any): boolean {
		let result: boolean = false;
		const char: string = this.stream.char;
		if (char === v) {
			result = true;
		}
		return result;
	}

	public code_is(code: number): boolean {
		let result: boolean = false;
		const code_: number = this.stream.charCode;
		if (code_ === code) {
			result = true;
			this.stream.next();
		}
		return result;
	}

	public skip(S: string): boolean {
		const result = this.stream.skip(S);
		this.stream.commit();
		return result;
	}

	public is_not(ss:string[]):boolean {
		let result:boolean = true;
		for (let index = 0; index < ss.length; index++) {
			if (this.skip(ss[index])) {
				result = false;
				break;
			}
		}
		return result;
	}

	public range(s: number, e: number): boolean {
		let result: boolean = false;
		const code: number = this.stream.charCode;
		if ((s <= code) && (code <= e)) {
			result = true;
			this.stream.next();
		}
		return result;
	}

	public serial(f: Array<(...args: any[]) => boolean>): boolean {
		let result: boolean = true;
		for (let index = 0; index < f.length; index++) {
			let evaluation: (...args: any[]) => boolean = f[index];
			if (!evaluation()) {
				result = false;
				break;
			}
		}
		return result;
	}

	public commit(evaluation: (...args: any[]) => boolean): boolean {
		let result: boolean = false;
		if (evaluation()) {
			result = true;
			this.stream.commit();
		}
		return result;
	}

	public select(f: Array<(...args: any[]) => boolean>): boolean {
		let result: boolean = false;
		for (let index = 0; index < f.length; index++) {
			let evaluation: (...args: any[]) => boolean = f[index];
			if (evaluation()) {
				result = true;
				break;
			}
		}
		return result;
	}

	public option(evaluation: (...args: any[]) => boolean): boolean {
		let result: boolean = true;
		evaluation();
		return result;
	}

	public repeat0(evaluation: (...args: any[]) => boolean): boolean {
		let result: boolean = true;
		while (evaluation()) {
		}
		return result;
	}

	public repeat1(evaluation: (...args: any[]) => boolean): boolean {
		let result: boolean = false;
		while (evaluation()) {
			result = true;
		}
		return result;
	}


}

export class HTMLParser extends TokenScanner {

	//	prolog element Misc*
	public is_document(): boolean {
		return this.serial([
			() => {return this.is_prolog()},
			() => {return this.is_element()} ,
			() => {return this.repeat0(() => {return this.is_Misc()})}
			]);
	}

	// #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
	public is_Char(): boolean {
		return this.select([
		() => {return this.code_is(0x9)},
		() => {return this.code_is(0xA)},
		() => {return this.code_is(0xD)},
		() => {return this.range(0x20,0xD7FF)},
		() => {return this.range(0xE000, 0xFFFD)},
		() => {return this.range(0x10000, 0x10FFFF)}
		]);
	}

	public is_Char2(): boolean {
		return this.select([
			() => {return this.code_is(0x9)},
			() => {return this.code_is(0xA)},
			() => {return this.code_is(0xD)},
			() => {return this.range(0x20,0x2C)},
			() => {return this.range(0x2E,0xD7FF)},
			() => {return this.range(0xE000, 0xFFFD)},
			() => {return this.range(0x10000, 0x10FFFF)}
		]);
	}


	//(#x20 | #x9 | #xD | #xA)+
	public is_S(): boolean {
		return this.repeat0(() => {return this.select([
			() => {return this.code_is(0x20)},
			() => {return this.code_is(0x9)},
			() => {return this.code_is(0xD)},
			() => {return this.code_is(0xA)},
		])});
	}

	// ":"| [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
	public is_NameStartChar(): boolean {
		return this.select(
		[() => {return this.char_is(":")},
			() => {return this.range(0x41,0x5A)},
			() => {return this.char_is("_")},
			() => {return this.range(0x61,0x7A)},
			() => {return this.range(0xC0,0xD6)},
			() => {return this.range(0xD8,0xF6)},
			() => {return this.range(0xF8,0x2FF)},
			() => {return this.range(0x370,0x37D)},
			() => {return this.range(0x37F,0x1FFF)},
			() => {return this.range(0x200C,0x200D)},
			() => {return this.range(0x2070,0x218F)},
			() => {return this.range(0x2C00,0x2FEF)},
			() => {return this.range(0x3001,0xD7FF)},
			() => {return this.range(0xF900,0xFDCF)},
			() => {return this.range(0xFDF0,0xFFFD)},
			() => {return this.range(0x10000,0xEFFFF)}]);
	}

	//	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
	public is_NameChar(): boolean {
		return this.select([
			() => {return this.is_NameStartChar()},
			() => {return this.char_is("-")},
			() => {return this.char_is(".")},
			() => {return this.range(0x30,0x39)},
			() => {return this.code_is(0xB7)},
			() => {return this.range(0x0300,0x036F)},
			() => {return this.range(0x203F,0x2040)},
		]);
	}

	//	NameStartChar (NameChar)*
	public is_Name(): boolean {
		return this.serial([
			() => {return this.is_NameStartChar()},
			() => {return this.repeat0(() => {return this.is_NameChar();})}
		]);
	}

	//  Name  (#x20 Name)*
	public is_Names(): boolean {
		return this.repeat0(
			() => {return this.serial([
				() => {return this.code_is(0x20)},
				() => {return this.is_Name()},
			])}
		)
	}

	//	(NameChar)+
	public is_Nmtoken(): boolean {
		return this.repeat1(() => {
			return this.is_NameChar();
		});
	}

	//	Nmtoken (#x20 Nmtoken)*
	public is_Nmtokens(): boolean {
		return this.repeat0(() => {
			return this.serial([
				() => {return this.code_is(0x20)},
				() => {return this.is_Nmtoken()}
			]);
		});
	}

	//	'"' ([^%&"] | PEReference | Reference)* '"' |  "'" ([^%&'] | PEReference | Reference)* "'"
	public is_EntityValue(): boolean {
		return this.select([
			() => {return this.serial([
					() => {return this.char_is('"')},
					() => {return this.repeat0(
						() => {return this.select([
							() => {return this.is_not(['%','&','"'])},
							() => {return this.is_PEReference()},
							() => {return this.is_Reference()},
						])
						})},
					() => {return this.char_is('"')},
				]);
			},
			() => {return this.serial([
					() => {return this.char_is("'")},
					() => {return this.repeat0(
						() => {return this.select([
								() => {return this.is_not(['%','&','"'])},
								() => {return this.is_PEReference()},
								() => {return this.is_Reference()},
							])
						})},
					() => {return this.char_is("'")},
				]);
			},
		]);
	}

	//	'"' ([^<&"] | Reference)* '"' |  "'" ([^<&'] | Reference)* "'"
	public is_AttValue(): boolean {
		return this.select([
			() => {return this.serial([
				() => {return this.char_is('"')},
				() => {return this.repeat0(
					() => {return this.select([
						() => {

							return this.is_not(['<','&','"'])


						},
						() => {
							return this.is_Reference()
						},
					])
					})},
				() => {return this.char_is('"')},
			]);
			},
			() => {return this.serial([
				() => {return this.char_is("'")},
				() => {return this.repeat0(
					() => {return this.select([
						() => {
							return this.is_not(['%','&',"'"])

						},
						() => {
							return this.is_Reference()
						},
					])
					})},
				() => {return this.char_is("'")},
			]);
			},
		]);
	}

	//	('"' [^"]* '"') | ("'" [^']* "'")
	public is_SystemLiteral(): boolean {
		return this.select([
			() => {return this.serial([
				() => {return this.char_is('"')},
				() => {return this.repeat0(
					() => {return this.is_not(['"'])}
				)},
				() => {return this.char_is('"')},
			]);
			},
			() => {return this.serial([
				() => {return this.char_is("'")},
				() => {return this.repeat0(

					() => {
						return this.is_not(["'"]);
					}
				)},
				() => {return this.char_is("'")},
			]);
			},
		]);
	}

	//	'"' PubidChar* '"' | "'" (PubidChar - "'")* "'"
	public is_PubidLiteral(): boolean {
		return this.select([
			() => {return this.serial([
				() => {return this.char_is('"')},
				() => {return this.repeat0(
					() => {
						return this.is_PubidChar();
					},
				)},
				() => {return this.char_is('"')},
			]);
			},
			() => {return this.serial([
				() => {return this.char_is("'")},
				() => {return this.repeat0(

						() => {
							return this.is_PubidChar2();
						},
					)},
				() => {return this.char_is("'")},
			]);
			},
		]);
	}

	// #x20 | #xD | #xA | [a-zA-Z0-9] | [-'()+,./:=?;!*#@$_%]
	public is_PubidChar(): boolean {
		return this.select([
			() => {return this.code_is(0x20)},
			() => {return this.code_is(0xD)},
			() => {return this.code_is(0xA)},
			() => {return this.range(0x61,0x7A)},
			() => {return this.range(0x41,0x5A)},
			() => {return this.range(0x30,0x39)},
			() => {return this.char_is('[')},
			() => {return this.char_is('-')},
			() => {return this.char_is("'")},
			() => {return this.char_is('(')},
			() => {return this.char_is(')')},
			() => {return this.char_is('+')},
			() => {return this.char_is(',')},
			() => {return this.char_is('.')},
			() => {return this.char_is('/')},
			() => {return this.char_is(':')},
			() => {return this.char_is('=')},
			() => {return this.char_is('?')},
			() => {return this.char_is(';')},
			() => {return this.char_is('!')},
			() => {return this.char_is('*')},
			() => {return this.char_is('#')},
			() => {return this.char_is('@')},
			() => {return this.char_is('$')},
			() => {return this.char_is('_')},
			() => {return this.char_is('%')},
		]);
	}

	// #x20 | #xD | #xA | [a-zA-Z0-9] | [-()+,./:=?;!*#@$_%]
	public is_PubidChar2(): boolean {
		return this.select([
			() => {return this.code_is(0x20)},
			() => {return this.code_is(0xD)},
			() => {return this.code_is(0xA)},
			() => {return this.range(0x61,0x7A)},
			() => {return this.range(0x41,0x5A)},
			() => {return this.range(0x30,0x39)},
			() => {return this.char_is('[')},
			() => {return this.char_is('-')},
			() => {return this.char_is('(')},
			() => {return this.char_is(')')},
			() => {return this.char_is('+')},
			() => {return this.char_is(',')},
			() => {return this.char_is('.')},
			() => {return this.char_is('/')},
			() => {return this.char_is(':')},
			() => {return this.char_is('=')},
			() => {return this.char_is('?')},
			() => {return this.char_is(';')},
			() => {return this.char_is('!')},
			() => {return this.char_is('*')},
			() => {return this.char_is('#')},
			() => {return this.char_is('@')},
			() => {return this.char_is('$')},
			() => {return this.char_is('_')},
			() => {return this.char_is('%')},
		]);
	}

	public is_CharData(): boolean {
		let result: boolean = false;
		//	[^<&]* - ([^<&]* ']]>' [^<&]*)

		return result;
	}

	//	'<!--' ((Char - '-') | ('-' (Char - '-')))* '-->'
	public is_Comment(): boolean {
		return this.serial([
			() => {return this.skip("<!--")},
			() => {return this.repeat0(
				() => {return this.commit(
						() => {return this.is_Char2()}
				)}
//				() => {return this.select([
//					() => {return this.is_Char2()},
//					() => {return this.serial([
//						() => {return this.char_is("-")},
//						() => {return this.is_Char2()},
//					])}
//				])},
		)},
			() => {return this.skip("-->")},
		])
	}

	public is_PI(): boolean {
 		// :todo -
		//	'<?' PITarget (S (Char* - (Char* '?>' Char*)))? '?>'
		return this.serial([
			() => {return this.skip('<?')},
			() => {return this.is_PITarget()},
			() => {return this.option(
				() => {return this.serial([
					() => {return this.is_S()},
					() => {return this.repeat0(() => {return this.is_Char()})}
				])}
			)},
			() => {return this.skip('?>')},
		])
	}

	public is_PITarget(): boolean {
		let result: boolean = false;
		// :todo -
		//	Name - (('X' | 'x') ('M' | 'm') ('L' | 'l'))

		return result;
	}

	//	CDStart CData CDEnd
	public is_CDSect(): boolean {
		return this.serial([
			() => {return this.is_CDStart()},
			() => {return this.is_CData()},
			() => {return this.is_CDEnd()}
		]);
	}

	//	'<![CDATA['
	public is_CDStart(): boolean {
		return this.skip('<![CDATA[');
	}

	public is_CData(): boolean {
		// :todo -
		//	(Char* - (Char* ']]>' Char*))
		return this.repeat0(() => {return this.is_Char()})
	}

	//	']]>'
	public is_CDEnd(): boolean {
		return this.skip(']]>');
	}

	//	XMLDecl? Misc* (doctypedecl Misc*)?
	public is_prolog(): boolean {
		return this.serial([
			() => {return this.option(
				() => {return this.is_XMLDecl()}
			)},
			() => {return this.repeat0(
				() => {return this.is_Misc()}
			)},
			() => {return this.option(
				() => {return this.serial([
						() => {return this.is_doctypedecl()},
						() => {return this.repeat0(
						() => {return this.is_Misc()}
						)},
				])},
			)},
		]);
	}

	//	'<?xml' VersionInfo EncodingDecl? SDDecl? S? '?>'
	public is_XMLDecl(): boolean {
		return this.serial([
			() => {return this.skip('<?xml');},
			() => {return this.is_VersionInfo();},
			() => {return this.option(() => {return this.is_EncodingDecl()});},
			() => {return this.option(() => {return this.is_SDDecl()});},
			() => {return this.option(() => {return this.is_S()});},
			() => {return this.skip('?>');},
		]);
	}

	//	S 'version' Eq ("'" VersionNum "'" | '"' VersionNum '"')
	public is_VersionInfo(): boolean {
		return this.serial([
			() => {return this.is_S()},
			() => {return this.skip('version')},
			() => {return this.is_Eq()},
			() => {return this.select([
				() => {return this.serial([
					() => {return this.char_is("'")},
					() => {return this.is_VersionNum()},
					() => {return this.char_is("'")},
				])},
				() => {return this.serial([
					() => {return this.char_is('"')},
					() => {return this.is_VersionNum()},
					() => {return this.char_is('"')},
				])},
			])},
		])
	}

	//	S? '=' S?
	public is_Eq(): boolean {
		return this.serial([
			() => {return this.option(
				() => {return this.is_S()},
			)},
			() => {return this.char_is('=')},
			() => {return this.option(
				() => {return this.is_S()},
			)},
		]);
	}

	//	'1.' [0-9]+
	public is_VersionNum(): boolean {
		return this.serial([
			() => {return this.skip('1.')},
			() => {return this.repeat1(
				() => {return this.select([
					() => {return this.char_is('0')},
					() => {return this.char_is('1')},
					() => {return this.char_is('2')},
					() => {return this.char_is('3')},
					() => {return this.char_is('4')},
					() => {return this.char_is('5')},
					() => {return this.char_is('6')},
					() => {return this.char_is('7')},
					() => {return this.char_is('8')},
					() => {return this.char_is('9')},
				])},
			)},
		]);
	}

	//	Comment | PI | S
	public is_Misc(): boolean {
		return this.select([
			() => {return this.is_Comment()},
			() => {return this.is_PI()},
			() => {return this.is_S()},
		]);
	}

	//	'<!DOCTYPE' S Name (S ExternalID)? S? ('[' intSubset ']' S?)? '>'
	public is_doctypedecl(): boolean {
		return this.serial([
			() => {return this.skip("<!DOCTYPE")},
			() => {return this.is_S()},
			() => {return this.is_Name()},
			() => {return this.option(	() => {return this.serial([
				() => {return this.is_S()},
				() => {return this.is_ExternalID()},
			])})},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.option(	() => {return this.serial([
				() => {return this.char_is('[')},
				() => {return this.is_intSubset()},
				() => {return this.char_is(']')},
				() => {return this.option(() => {return this.is_S()})},
			])})},
			() => {return this.char_is(">")},
		]);
	}

	//	PEReference | S
	public is_DeclSep(): boolean {
		return this.select([
			() => {return this.is_PEReference()},
			() => {return this.is_S()},
		]);
	}

	//	(markupdecl | DeclSep)*
	public is_intSubset(): boolean {
		return this.repeat0(
			() => {return this.select([
				() => {return this.is_markupdecl()},
				() => {return this.is_DeclSep()}
			])},
		)
	}

	//	elementdecl | AttlistDecl | EntityDecl | NotationDecl | PI | Comment
	public is_markupdecl(): boolean {
		return this.select([
			() => {return this.is_elementdecl()},
			() => {return this.is_AttlistDecl()},
			() => {return this.is_EntityDecl()},
			() => {return this.is_NotationDecl()},
			() => {return this.is_PI()},
			() => {return this.is_Comment()},
		]);
	}

	//	TextDecl? extSubsetDecl
	public is_extSubset(): boolean {
		return this.serial([
			() => {return this.option(() => {return this.is_TextDecl()})},
			() => {return this.is_extSubsetDecl()}
		]);
	}

	//	( markupdecl | conditionalSect | DeclSep)*
	public is_extSubsetDecl(): boolean {
		return this.repeat0(
			() => {return this.select([
				() => {return this.is_markupdecl()},
				() => {return this.is_conditionalSect()},
				() => {return this.is_DeclSep()},
			])}
		);
	}

	//	S 'standalone' Eq (("'" ('yes' | 'no') "'") | ('"' ('yes' | 'no') '"'))
	public is_SDDecl(): boolean {
		return this.serial([
			() => {return this.is_S()},
			() => {return this.skip("standalone")},
			() => {return this.is_Eq()},
			() => {return this.select([
				() => {return this.serial([
					() => {return this.char_is("'")},
					() => {return this.select([
						() => {return this.skip("yes")},
						() => {return this.skip("no")},
					])},
					() => {return this.char_is("'")},
				])},
				() => {return this.serial([
					() => {return this.char_is('"')},
					() => {return this.select([
						() => {return this.skip("yes")},
						() => {return this.skip("no")},
					])},
					() => {return this.char_is('"')},
				])}
			])},
		]);
	}

	//	EmptyElemTag | STag content ETag
	public is_element(): boolean {
		return this.select([
			() => {return this.is_EmptyElemTag()},
			() => {return this.serial([
				() => {return this.is_STag()},
				() => {return this.is_content()},
				() => {return this.is_ETag()},
			])},
		]);
	}

	//	'<' Name (S Attribute)* S? '>'
	public is_STag(): boolean {
		return this.serial([
			() => {return this.char_is('<')},
			() => {return this.is_Name()},
			() => {return this.repeat0(
				() => {return this.select([
					() => {return this.is_S()},
					() => {return this.is_Attribute()},
				])},
			)},
			() => {return this.char_is('>')},
		]);
	}

	//	Name Eq AttValue
	public is_Attribute(): boolean {
		return this.serial([
			() => {return this.is_Name()},
			() => {return this.is_Eq()},
			() => {return this.is_AttValue()},
		]);
	}

	//	'</' Name S? '>'
	public is_ETag(): boolean {
		return this.serial([
			() => {return this.skip('</')},
			() => {return this.is_Name()},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is('</')},
		])
	}

	//	CharData? ((element | Reference | CDSect | PI | Comment) CharData?)*
	public is_content(): boolean {
		return this.serial([
			() => {return this.option(() => {return this.is_CData()})},
			() => {return this.repeat0(() => {return this.serial([
				() => {return this.select([
					() => {return this.is_element()},
					() => {return this.is_Reference()},
					() => {return this.is_CDSect()},
					() => {return this.is_PI()},
					() => {return this.is_Comment()},
				])},
				() => {return this.option(() => {return this.is_CData()})},
			])})},
		])
	}

	//	'<' Name (S Attribute)* S? '/>'
	public is_EmptyElemTag(): boolean {
		return this.serial([
			() => {return this.char_is('<')},
			() => {return this.is_Name()},
			() => {return this.repeat0(() => {return this.serial([
				() => {return this.is_S()},
				() => {return this.is_Attribute()},
			])})},
			() => {return this.skip('/>')},
		])
	}

	//	'<!ELEMENT' S Name S contentspec S? '>'
	public is_elementdecl(): boolean {
		return this.serial([
			() => {return this.skip('<!ATTLIST')},
			() => {return this.is_S()},
			() => {return this.is_Name()},
			() => {return this.is_S()},
			() => {return this.is_contentspec()},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is('>')},
		])
	}

	//	'EMPTY' | 'ANY' | Mixed | children
	public is_contentspec(): boolean {
		return this.select([
			() => {return this.skip('EMPTY')},
			() => {return this.skip('ANY')},
			() => {return this.is_Mixed()},
			() => {return this.is_children()},
		])
	}

	//	(choice | seq) ('?' | '*' | '+')?
	public is_children(): boolean {
		return this.serial([
			() => {return this.select([
				() => {return this.is_choice()},
				() => {return this.is_seq()},
			])},
			() => {return this.option(() => {return this.select([
					() => {return this.char_is('?')},
					() => {return this.char_is('*')},
					() => {return this.char_is('+')},
				])},
			)}
		])
	}

	//	(Name | choice | seq) ('?' | '*' | '+')?
	public is_cp(): boolean {
		return this.serial([
			() => {return this.select([
				() => {return this.is_Name()},
				() => {return this.is_choice()},
				() => {return this.is_seq()},
			])},
			() => {return this.option(() => {return this.select([
					() => {return this.char_is('?')},
					() => {return this.char_is('*')},
					() => {return this.char_is('+')},
				])},
			)}
		])
	}

	//	'(' S? cp ( S? '|' S? cp )+ S? ')'
	public is_choice(): boolean {
		return this.serial([
			() => {return this.char_is('(')},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.is_cp()},
			() => {return this.repeat0(() => {return this.serial([
				() => {return this.option(() => {return this.is_S()})},
				() => {return this.char_is('|')},
				() => {return this.option(() => {return this.is_S()})},
				() => {return this.is_cp()},
			])})},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is(')')},
		])
	}

	//	'(' S? cp ( S? ',' S? cp )* S? ')'
	public is_seq(): boolean {
		return this.serial([
			() => {return this.char_is('(')},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.is_cp()},
			() => {return this.repeat0(() => {return this.serial([
				() => {return this.option(() => {return this.is_S()})},
				() => {return this.char_is(',')},
				() => {return this.option(() => {return this.is_S()})},
				() => {return this.is_cp()},
			])})},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is(')')},
		])
	}

	//	'(' S? '#PCDATA' (S? '|' S? Name)* S? ')*' | '(' S? '#PCDATA' S? ')'
	public is_Mixed(): boolean {
	return this.select([
		() => {	return this.serial([
			() => {return this.char_is('(')},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.skip('#PCDATA')},
			() => {return this.repeat0(() => {return this.serial([
				() => {return this.option(() => {return this.is_S()})},
				() => {return this.char_is('|')},
				() => {return this.option(() => {return this.is_S()})},
				() => {return this.is_Name()},
			])})},
			() => {return this.skip(')*')},
		])},
		() => {	return this.serial([
			() => {return this.char_is('(')},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.skip('#PCDATA')},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is(')')},
		])},
	])
	}

	//	'<!ATTLIST' S Name AttDef* S? '>'
	public is_AttlistDecl(): boolean {
		return this.serial([
			() => {return this.skip('<!ATTLIST')},
			() => {return this.is_S()},
			() => {return this.is_Name()},
			() => {return this.repeat0(() => {return this.is_AttDef()})},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is('>')},
		]);
	}

	//	S Name S AttType S DefaultDecl
	public is_AttDef(): boolean {
		return this.serial([
			() => {return this.is_S()},
			() => {return this.is_Name()},
			() => {return this.is_S()},
			() => {return this.is_AttType()},
			() => {return this.is_S()},
			() => {return this.is_DefaultDecl()},
		])
	}

	//	StringType | TokenizedType | EnumeratedType
	public is_AttType(): boolean {
		return this.select([
			() => {return this.is_StringType()},
			() => {return this.is_TokenizedType()},
			() => {return this.is_EnumeratedType()},
		])
	}

	//	'CDATA'
	public is_StringType(): boolean {
		return this.skip('CDATA')
	}

	//	'ID' | 'IDREF' | 'IDREFS' | 'ENTITY' | 'ENTITIES' | 'NMTOKEN' | 'NMTOKENS'
	public is_TokenizedType(): boolean {
		return this.select([
			() => {return this.skip('ID')},
			() => {return this.skip('IDREF')},
			() => {return this.skip('IDREFS')},
			() => {return this.skip('ENTITY')},
			() => {return this.skip('ENTITIES')},
			() => {return this.skip('NMTOKEN')},
			() => {return this.skip('NMTOKENS')}
		]);
	}

	//	NotationType | Enumeration
	public is_EnumeratedType(): boolean {
		return this.select([
			() => {return this.is_NotationType()},
			() => {return this.is_Enumeration()},
		])
	}

	//	'NOTATION' S '(' S? Name (S? '|' S? Name)* S? ')'
	public is_NotationType(): boolean {
		return this.serial([
			() => {return this.skip('NOTATION')},
			() => {return this.is_S()},
			() => {return this.char_is('(')},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.is_Name()},
			() => {return this.repeat0(() => {return this.serial([
				() => {return this.option(() => {return this.is_S()})},
				() => {return this.char_is('|')},
				() => {return this.option(() => {return this.is_S()})},
				() => {return this.is_Name()},
			])})},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is(')')},
		])
	}

	//	'(' S? Nmtoken (S? '|' S? Nmtoken)* S? ')'
	public is_Enumeration(): boolean {
		return this.serial([
			() => {return this.char_is('(')},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.is_Nmtoken()},
			() => {return this.repeat0(() => {return this.serial([
				() => {return this.option(() => {return this.is_S()})},
				() => {return this.char_is('|')},
				() => {return this.option(() => {return this.is_S()})},
				() => {return this.is_Nmtoken()},
			])})},
			() => {return this.option(() => {return this.is_S()})},
		])
	}

	//	'#REQUIRED' | '#IMPLIED'| (('#FIXED' S)? AttValue)
	public is_DefaultDecl(): boolean {
		return this.select([
			() => {return this.skip('#REQUIRED')},
			() => {return this.skip('#IMPLIED')},
			() => {return this.option(() => {return this.serial([
				() => {return this.skip('#FIXED')},
				() => {return this.is_S()},
				() => {return this.is_AttValue()},
			])})},
		])
	}

	//	includeSect | ignoreSect
	public is_conditionalSect(): boolean {
		return this.select([
			() => {return this.is_includeSect()},
			() => {return this.is_ignoreSect()},
		])
	}

	//	'<![' S? 'INCLUDE' S? '[' extSubsetDecl ']]>'
	public is_includeSect(): boolean {
		return this.serial([
			() => {return this.skip('<![')},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.skip('INCLUDE')},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is('[')},
			() => {return this.is_extSubsetDecl()},
			() => {return this.skip(']]>')},
		])
	}

	//	'<![' S? 'IGNORE' S? '[' ignoreSectContents* ']]>'
	public is_ignoreSect(): boolean {
		return this.serial([
			() => {return this.skip('<![')},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.is_Ignore()},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is('[')},
			() => {return this.repeat0(() => {return this.is_ignoreSectContents()})},
			() => {return this.skip(']]>')},
		])
	}

	//	Ignore ('<![' ignoreSectContents ']]>' Ignore)*
	public is_ignoreSectContents(): boolean {
		return this.serial([
			() => {return this.is_Ignore()},
			() => {return this.repeat0(
				() => {return this.serial([
					() => {return this.skip('<![')},
					() => {return this.is_ignoreSectContents()},
					() => {return this.skip(']]>')},
					() => {return this.is_Ignore()},
				])},
			)},
		])
	}

	public is_Ignore(): boolean {
		// :todo -
		//	Char* - (Char* ('<![' | ']]>') Char*)
		return this.repeat0(() => {return this.is_Char()})
	}

	//	'&#' [0-9]+ ';' | '&#x' [0-9a-fA-F]+ ';'
	public is_CharRef(): boolean {
		return this.select([
			() => {return this.serial([
				() => {return this.skip('&#')},
				() => {return this.repeat1(() => {return this.range(0x30,0x39)})},
				() => {return this.char_is(';')},
			])},
			() => {return this.serial([
				() => {return this.skip('&#x')},
				() => {return this.repeat1(
					() => {return this.select([
						() => {return this.range(0x30,0x39)},
						() => {return this.range(0x41,0x46)},
						() => {return this.range(0x61,0x66)},
					])}
				)},
				() => {return this.char_is(';')},
			])},
		])
	}

	//	EntityRef | CharRef
	public is_Reference(): boolean {
		return this.select([
			() => {return this.is_EntityRef()},
			() => {return this.is_CharRef()},
		])
	}

	//	'&' Name ';'
	public is_EntityRef(): boolean {
		return this.serial([
			() => {return this.char_is("&")},
			() => {return this.is_Name()},
			() => {return this.char_is(";")},
		]);
	}

	//	'%' Name ';'
	public is_PEReference(): boolean {
		return this.serial([
			() => {return this.char_is("%")},
			() => {return this.is_Name()},
			() => {return this.char_is(";")},
		]);
	}

	//	GEDecl | PEDecl
	public is_EntityDecl(): boolean {
		return this.select([
			() => {return this.is_GEDecl()},
			() => {return this.is_PEDecl()},
		])
	}

	//	'<!ENTITY' S Name S EntityDef S? '>'
	public is_GEDecl(): boolean {
		return this.serial([
			() => {return this.skip('<!ENTITY')},
			() => {return this.is_S()},
			() => {return this.is_Name()},
			() => {return this.is_S()},
			() => {return this.is_EntityRef()},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is('>')},
		])
	}

	//	'<!ENTITY' S '%' S Name S PEDef S? '>'
	public is_PEDecl(): boolean {
		return this.serial([
			() => {return this.skip('<!ENTITY')},
			() => {return this.is_S()},
			() => {return this.char_is('%')},
			() => {return this.is_S()},
			() => {return this.is_Name()},
			() => {return this.is_S()},
			() => {return this.is_PEDef()},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is('>')},
		])
	}

	//	EntityValue | (ExternalID NDataDecl?)
	public is_EntityDef(): boolean {
		return this.select([
			() => {return this.is_EntityValue()},
			() => {return this.serial([
				() => {return this.is_ExternalID()},
				() => {return this.option(() => {return this.is_NDataDecl()})},
			])},
		])
	}

	//	EntityValue | ExternalID
	public is_PEDef(): boolean {
		return this.select([
			() => {return this.is_EntityValue()},
			() => {return this.is_ExternalID()},
		])
	}

	//	'SYSTEM' S SystemLiteral | 'PUBLIC' S PubidLiteral S SystemLiteral
	public is_ExternalID(): boolean {
		return this.select([
			() => {return this.serial([
				() => {return this.skip('SYSTEM')},
				() => {return this.is_S()},
				() => {return this.is_SystemLiteral()},
			])},
			() => {return this.serial([
				() => {return this.skip('PUBLIC')},
				() => {return this.is_S()},
				() => {return this.is_PubidLiteral()},
				() => {return this.is_S()},
				() => {return this.is_SystemLiteral()},
			])},
		])
	}

	//	S 'NDATA' S Name
	public is_NDataDecl(): boolean {
		return this.serial([
			() => {return this.is_S()},
			() => {return this.skip('NDATA')},
			() => {return this.is_S()},
			() => {return this.is_Name()},
		])
	}

	//	'<?xml' VersionInfo? EncodingDecl S? '?>'
	public is_TextDecl(): boolean {
		return this.serial([
			() => {return this.skip('<?xml')},
			() => {return this.option(() => {return this.is_VersionInfo()})},
			() => {return this.is_EncodingDecl()},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.skip('?>')},
		])
	}

	//	S 'encoding' Eq ('"' EncName '"' | "'" EncName "'" )
	public is_EncodingDecl(): boolean {
		return this.serial([
			() => {return this.is_S()},
			() => {return this.skip('encoding')},
			() => {return this.is_Eq()},
			() => {return this.select([
				() => {return this.serial([
					() => {return this.char_is('"')},
					() => {return this.is_EncName()},
					() => {return this.char_is('"')}
				])},
				() => {return this.serial([
					() => {return this.char_is("'")},
					() => {return this.is_EncName()},
					() => {return this.char_is("'")}
				])},
			])},
		])
	}

	//	[A-Za-z]
	public is_EncName(): boolean {
		return this.select([
			() => {return this.range(0x41,0x5A)},
			() => {return this.range(0x61,0x7A)},
		])
	}

	//	'<!NOTATION' S Name S (ExternalID | PublicID) S? '>'
	public is_NotationDecl(): boolean {
		return this.serial([
			() => {return this.skip('<!NOTATION')},
			() => {return this.is_S()},
			() => {return this.is_Name()},
			() => {return this.is_S()},
			() => {return this.select([
				() => {return this.is_ExternalID()},
				() => {return this.is_PublicID()},
			])},
			() => {return this.option(() => {return this.is_S()})},
			() => {return this.char_is(">")}
		])
	}

	//	'PUBLIC' S PubidLiteral
	public is_PublicID(): boolean {
		return this.serial([
			() => {return this.skip('PUBLIC')},
			() => {return this.is_S()},
			() => {return this.is_PubidLiteral()},
		])
	}

	//	BaseChar | Ideographic
	public is_Letter(): boolean {
		return this.select([
			() => {return this.is_BaseChar()},
			() => {return this.is_Ideographic()},
		])
	}

	//	[#x0041-#x005A] | [#x0061-#x007A] | [#x00C0-#x00D6] | [#x00D8-#x00F6] | [#x00F8-#x00FF] | [#x0100-#x0131] | [#x0134-#x013E] | [#x0141-#x0148] | [#x014A-#x017E] | [#x0180-#x01C3] | [#x01CD-#x01F0] | [#x01F4-#x01F5] | [#x01FA-#x0217] | [#x0250-#x02A8] | [#x02BB-#x02C1] | #x0386 | [#x0388-#x038A] | #x038C | [#x038E-#x03A1] | [#x03A3-#x03CE] | [#x03D0-#x03D6] | #x03DA | #x03DC | #x03DE | #x03E0 | [#x03E2-#x03F3] | [#x0401-#x040C] | [#x040E-#x044F] | [#x0451-#x045C] | [#x045E-#x0481] | [#x0490-#x04C4] | [#x04C7-#x04C8] | [#x04CB-#x04CC] | [#x04D0-#x04EB] | [#x04EE-#x04F5] | [#x04F8-#x04F9] | [#x0531-#x0556] | #x0559 | [#x0561-#x0586] | [#x05D0-#x05EA] | [#x05F0-#x05F2] | [#x0621-#x063A] | [#x0641-#x064A] | [#x0671-#x06B7] | [#x06BA-#x06BE] | [#x06C0-#x06CE] | [#x06D0-#x06D3] | #x06D5 | [#x06E5-#x06E6] | [#x0905-#x0939] | #x093D | [#x0958-#x0961] | [#x0985-#x098C] | [#x098F-#x0990] | [#x0993-#x09A8] | [#x09AA-#x09B0] | #x09B2 | [#x09B6-#x09B9] | [#x09DC-#x09DD] | [#x09DF-#x09E1] | [#x09F0-#x09F1] | [#x0A05-#x0A0A] | [#x0A0F-#x0A10] | [#x0A13-#x0A28] | [#x0A2A-#x0A30] | [#x0A32-#x0A33] | [#x0A35-#x0A36] | [#x0A38-#x0A39] | [#x0A59-#x0A5C] | #x0A5E | [#x0A72-#x0A74] | [#x0A85-#x0A8B] | #x0A8D | [#x0A8F-#x0A91] | [#x0A93-#x0AA8] | [#x0AAA-#x0AB0] | [#x0AB2-#x0AB3] | [#x0AB5-#x0AB9] | #x0ABD | #x0AE0 | [#x0B05-#x0B0C] | [#x0B0F-#x0B10] | [#x0B13-#x0B28] | [#x0B2A-#x0B30] | [#x0B32-#x0B33] | [#x0B36-#x0B39] | #x0B3D | [#x0B5C-#x0B5D] | [#x0B5F-#x0B61] | [#x0B85-#x0B8A] | [#x0B8E-#x0B90] | [#x0B92-#x0B95] | [#x0B99-#x0B9A] | #x0B9C | [#x0B9E-#x0B9F] | [#x0BA3-#x0BA4] | [#x0BA8-#x0BAA] | [#x0BAE-#x0BB5] | [#x0BB7-#x0BB9] | [#x0C05-#x0C0C] | [#x0C0E-#x0C10] | [#x0C12-#x0C28] | [#x0C2A-#x0C33] | [#x0C35-#x0C39] | [#x0C60-#x0C61] | [#x0C85-#x0C8C] | [#x0C8E-#x0C90] | [#x0C92-#x0CA8] | [#x0CAA-#x0CB3] | [#x0CB5-#x0CB9] | #x0CDE | [#x0CE0-#x0CE1] | [#x0D05-#x0D0C] | [#x0D0E-#x0D10] | [#x0D12-#x0D28] | [#x0D2A-#x0D39] | [#x0D60-#x0D61] | [#x0E01-#x0E2E] | #x0E30 | [#x0E32-#x0E33] | [#x0E40-#x0E45] | [#x0E81-#x0E82] | #x0E84 | [#x0E87-#x0E88] | #x0E8A | #x0E8D | [#x0E94-#x0E97] | [#x0E99-#x0E9F] | [#x0EA1-#x0EA3] | #x0EA5 | #x0EA7 | [#x0EAA-#x0EAB] | [#x0EAD-#x0EAE] | #x0EB0 | [#x0EB2-#x0EB3] | #x0EBD | [#x0EC0-#x0EC4] | [#x0F40-#x0F47] | [#x0F49-#x0F69] | [#x10A0-#x10C5] | [#x10D0-#x10F6] | #x1100 | [#x1102-#x1103] | [#x1105-#x1107] | #x1109 | [#x110B-#x110C] | [#x110E-#x1112] | #x113C | #x113E | #x1140 | #x114C | #x114E | #x1150 | [#x1154-#x1155] | #x1159 | [#x115F-#x1161] | #x1163 | #x1165 | #x1167 | #x1169 | [#x116D-#x116E] | [#x1172-#x1173] | #x1175 | #x119E | #x11A8 | #x11AB | [#x11AE-#x11AF] | [#x11B7-#x11B8] | #x11BA | [#x11BC-#x11C2] | #x11EB | #x11F0 | #x11F9 | [#x1E00-#x1E9B] | [#x1EA0-#x1EF9] | [#x1F00-#x1F15] | [#x1F18-#x1F1D] | [#x1F20-#x1F45] | [#x1F48-#x1F4D] | [#x1F50-#x1F57] | #x1F59 | #x1F5B | #x1F5D | [#x1F5F-#x1F7D] | [#x1F80-#x1FB4] | [#x1FB6-#x1FBC] | #x1FBE | [#x1FC2-#x1FC4] | [#x1FC6-#x1FCC] | [#x1FD0-#x1FD3] | [#x1FD6-#x1FDB] | [#x1FE0-#x1FEC] | [#x1FF2-#x1FF4] | [#x1FF6-#x1FFC] | #x2126 | [#x212A-#x212B] | #x212E | [#x2180-#x2182] | [#x3041-#x3094] | [#x30A1-#x30FA] | [#x3105-#x312C] | [#xAC00-#xD7A3]
	public is_BaseChar(): boolean {
		return this.select([
			() => {return this.range(0x0041,0x005A)},
			() => {return this.range(0x0061,0x007A)},
			() => {return this.range(0x00C0,0x00D6)},
			() => {return this.range(0x00D8,0x00F6)},
			() => {return this.range(0x00F8,0x00FF)},
			() => {return this.range(0x0100,0x0131)},
			() => {return this.range(0x0134,0x013E)},
			() => {return this.range(0x0141,0x0148)},
			() => {return this.range(0x014A,0x017E)},
			() => {return this.range(0x0180,0x01C3)},
			() => {return this.range(0x01CD,0x01F0)},
			() => {return this.range(0x01F4,0x01F5)},
			() => {return this.range(0x01FA,0x0217)},
			() => {return this.range(0x0250,0x02A8)},
			() => {return this.range(0x02BB,0x02C1)},
			() => {return this.range(0x0388,0x038A)},
			() => {return this.range(0x038E,0x03A1)},
			() => {return this.range(0x03A3,0x03CE)},
			() => {return this.range(0x03D0,0x03D6)},
			() => {return this.range(0x03E2,0x03F3)},
			() => {return this.range(0x0401,0x040C)},
			() => {return this.range(0x040E,0x044F)},
			() => {return this.range(0x0451,0x045C)},
			() => {return this.range(0x045E,0x0481)},
			() => {return this.range(0x0490,0x04C4)},
			() => {return this.range(0x04C7,0x04C8)},
			() => {return this.range(0x04CB,0x04CC)},
			() => {return this.range(0x04D0,0x04EB)},
			() => {return this.range(0x04EE,0x04F5)},
			() => {return this.range(0x04F8,0x04F9)},
			() => {return this.range(0x0531,0x0556)},
			() => {return this.range(0x0561,0x0586)},
			() => {return this.range(0x05D0,0x05EA)},
			() => {return this.range(0x05F0,0x05F2)},
			() => {return this.range(0x0621,0x063A)},
			() => {return this.range(0x0641,0x064A)},
			() => {return this.range(0x0671,0x06B7)},
			() => {return this.range(0x06BA,0x06BE)},
			() => {return this.range(0x06C0,0x06CE)},
			() => {return this.range(0x06D0,0x06D3)},
			() => {return this.range(0x06E5,0x06E6)},
			() => {return this.range(0x0905,0x0939)},
			() => {return this.range(0x0958,0x0961)},
			() => {return this.range(0x0985,0x098C)},
			() => {return this.range(0x098F,0x0990)},
			() => {return this.range(0x0993,0x09A8)},
			() => {return this.range(0x09AA,0x09B0)},
			() => {return this.range(0x09B6,0x09B9)},
			() => {return this.range(0x09DC,0x09DD)},
			() => {return this.range(0x09DF,0x09E1)},
			() => {return this.range(0x09F0,0x09F1)},
			() => {return this.range(0x0A05,0x0A0A)},
			() => {return this.range(0x0A0F,0x0A10)},
			() => {return this.range(0x0A13,0x0A28)},
			() => {return this.range(0x0A2A,0x0A30)},
			() => {return this.range(0x0A32,0x0A33)},
			() => {return this.range(0x0A35,0x0A36)},
			() => {return this.range(0x0A38,0x0A39)},
			() => {return this.range(0x0A59,0x0A5C)},
			() => {return this.range(0x0A72,0x0A74)},
			() => {return this.range(0x0A85,0x0A8B)},
			() => {return this.range(0x0A8F,0x0A91)},
			() => {return this.range(0x0A93,0x0AA8)},
			() => {return this.range(0x0AAA,0x0AB0)},
			() => {return this.range(0x0AB2,0x0AB3)},
			() => {return this.range(0x0AB5,0x0AB9)},
			() => {return this.range(0x0B05,0x0B0C)},
			() => {return this.range(0x0B0F,0x0B10)},
			() => {return this.range(0x0B13,0x0B28)},
			() => {return this.range(0x0B2A,0x0B30)},
			() => {return this.range(0x0B32,0x0B33)},
			() => {return this.range(0x0B36,0x0B39)},
			() => {return this.range(0x0B5C,0x0B5D)},
			() => {return this.range(0x0B5F,0x0B61)},
			() => {return this.range(0x0B85,0x0B8A)},
			() => {return this.range(0x0B8E,0x0B90)},
			() => {return this.range(0x0B92,0x0B95)},
			() => {return this.range(0x0B99,0x0B9A)},
			() => {return this.range(0x0B9E,0x0B9F)},
			() => {return this.range(0x0BA3,0x0BA4)},
			() => {return this.range(0x0BA8,0x0BAA)},
			() => {return this.range(0x0BAE,0x0BB5)},
			() => {return this.range(0x0BB7,0x0BB9)},
			() => {return this.range(0x0C05,0x0C0C)},
			() => {return this.range(0x0C0E,0x0C10)},
			() => {return this.range(0x0C12,0x0C28)},
			() => {return this.range(0x0C2A,0x0C33)},
			() => {return this.range(0x0C35,0x0C39)},
			() => {return this.range(0x0C60,0x0C61)},
			() => {return this.range(0x0C85,0x0C8C)},
			() => {return this.range(0x0C8E,0x0C90)},
			() => {return this.range(0x0C92,0x0CA8)},
			() => {return this.range(0x0CAA,0x0CB3)},
			() => {return this.range(0x0CB5,0x0CB9)},
			() => {return this.range(0x0CE0,0x0CE1)},
			() => {return this.range(0x0D05,0x0D0C)},
			() => {return this.range(0x0D0E,0x0D10)},
			() => {return this.range(0x0D12,0x0D28)},
			() => {return this.range(0x0D2A,0x0D39)},
			() => {return this.range(0x0D60,0x0D61)},
			() => {return this.range(0x0E01,0x0E2E)},
			() => {return this.range(0x0E32,0x0E33)},
			() => {return this.range(0x0E40,0x0E45)},
			() => {return this.range(0x0E81,0x0E82)},
			() => {return this.range(0x0E87,0x0E88)},
			() => {return this.range(0x0E94,0x0E97)},
			() => {return this.range(0x0E99,0x0E9F)},
			() => {return this.range(0x0EA1,0x0EA3)},
			() => {return this.range(0x0EAA,0x0EAB)},
			() => {return this.range(0x0EAD,0x0EAE)},
			() => {return this.range(0x0EB2,0x0EB3)},
			() => {return this.range(0x0EC0,0x0EC4)},
			() => {return this.range(0x0F40,0x0F47)},
			() => {return this.range(0x0F49,0x0F69)},
			() => {return this.range(0x10A0,0x10C5)},
			() => {return this.range(0x10D0,0x10F6)},
			() => {return this.range(0x1102,0x1103)},
			() => {return this.range(0x1105,0x1107)},
			() => {return this.range(0x110B,0x110C)},
			() => {return this.range(0x110E,0x1112)},
			() => {return this.range(0x1154,0x1155)},
			() => {return this.range(0x115F,0x1161)},
			() => {return this.range(0x116D,0x116E)},
			() => {return this.range(0x1172,0x1173)},
			() => {return this.range(0x11AE,0x11AF)},
			() => {return this.range(0x11B7,0x11B8)},
			() => {return this.range(0x11BC,0x11C2)},
			() => {return this.range(0x1E00,0x1E9B)},
			() => {return this.range(0x1EA0,0x1EF9)},
			() => {return this.range(0x1F00,0x1F15)},
			() => {return this.range(0x1F18,0x1F1D)},
			() => {return this.range(0x1F20,0x1F45)},
			() => {return this.range(0x1F48,0x1F4D)},
			() => {return this.range(0x1F50,0x1F57)},
			() => {return this.range(0x1F5F,0x1F7D)},
			() => {return this.range(0x1F80,0x1FB4)},
			() => {return this.range(0x1FB6,0x1FBC)},
			() => {return this.range(0x1FC2,0x1FC4)},
			() => {return this.range(0x1FC6,0x1FCC)},
			() => {return this.range(0x1FD0,0x1FD3)},
			() => {return this.range(0x1FD6,0x1FDB)},
			() => {return this.range(0x1FE0,0x1FEC)},
			() => {return this.range(0x1FF2,0x1FF4)},
			() => {return this.range(0x1FF6,0x1FFC)},
			() => {return this.range(0x212A,0x212B)},
			() => {return this.range(0x2180,0x2182)},
			() => {return this.range(0x3041,0x3094)},
			() => {return this.range(0x30A1,0x30FA)},
			() => {return this.range(0x3105,0x312C)},
			() => {return this.range(0xAC00,0xD7A3)},
			() => {return this.code_is(0x0386)},
			() => {return this.code_is(0x038C)},
			() => {return this.code_is(0x03DA)},
			() => {return this.code_is(0x03DC)},
			() => {return this.code_is(0x03DE)},
			() => {return this.code_is(0x03E0)},
			() => {return this.code_is(0x0559)},
			() => {return this.code_is(0x06D5)},
			() => {return this.code_is(0x093D)},
			() => {return this.code_is(0x09B2)},
			() => {return this.code_is(0x0A5E)},
			() => {return this.code_is(0x0ABD)},
			() => {return this.code_is(0x0AE0)},
			() => {return this.code_is(0x0A8D)},
			() => {return this.code_is(0x0B3D)},
			() => {return this.code_is(0x0B9C)},
			() => {return this.code_is(0x0CDE)},
			() => {return this.code_is(0x0E30)},
			() => {return this.code_is(0x0E84)},
			() => {return this.code_is(0x0E8A)},
			() => {return this.code_is(0x0E8D)},
			() => {return this.code_is(0x0EA5)},
			() => {return this.code_is(0x0EA7)},
			() => {return this.code_is(0x0EB0)},
			() => {return this.code_is(0x0EBD)},
			() => {return this.code_is(0x1100)},
			() => {return this.code_is(0x1109)},
			() => {return this.code_is(0x113C)},
			() => {return this.code_is(0x113E)},
			() => {return this.code_is(0x1140)},
			() => {return this.code_is(0x114C)},
			() => {return this.code_is(0x114E)},
			() => {return this.code_is(0x1150)},
			() => {return this.code_is(0x1159)},
			() => {return this.code_is(0x1163)},
			() => {return this.code_is(0x1165)},
			() => {return this.code_is(0x1167)},
			() => {return this.code_is(0x1169)},
			() => {return this.code_is(0x1175)},
			() => {return this.code_is(0x119E)},
			() => {return this.code_is(0x11A8)},
			() => {return this.code_is(0x11AB)},
			() => {return this.code_is(0x11BA)},
			() => {return this.code_is(0x11EB)},
			() => {return this.code_is(0x11F0)},
			() => {return this.code_is(0x11F9)},
			() => {return this.code_is(0x1F59)},
			() => {return this.code_is(0x1F5B)},
			() => {return this.code_is(0x1F5D)},
			() => {return this.code_is(0x1FBE)},
			() => {return this.code_is(0x2126)},
			() => {return this.code_is(0x212E)}
		]);
	}

	//	[#x4E00-#x9FA5] | #x3007 | [#x3021-#x3029]
	public is_Ideographic(): boolean {
		return this.select([
			() => {return this.code_is(0x3007)},
			() => {return this.range(0x4E00,0x9FA5)},
			() => {return this.range(0x3021,0x3029)}
		]);
	}

	//	[#x0300-#x0345] | [#x0360-#x0361] | [#x0483-#x0486] | [#x0591-#x05A1] | [#x05A3-#x05B9] | [#x05BB-#x05BD] | #x05BF | [#x05C1-#x05C2] | #x05C4 | [#x064B-#x0652] | #x0670 | [#x06D6-#x06DC] | [#x06DD-#x06DF] | [#x06E0-#x06E4] | [#x06E7-#x06E8] | [#x06EA-#x06ED] | [#x0901-#x0903] | #x093C | [#x093E-#x094C] | #x094D | [#x0951-#x0954] | [#x0962-#x0963] | [#x0981-#x0983] | #x09BC | #x09BE | #x09BF | [#x09C0-#x09C4] | [#x09C7-#x09C8] | [#x09CB-#x09CD] | #x09D7 | [#x09E2-#x09E3] | #x0A02 | #x0A3C | #x0A3E | #x0A3F | [#x0A40-#x0A42] | [#x0A47-#x0A48] | [#x0A4B-#x0A4D] | [#x0A70-#x0A71] | [#x0A81-#x0A83] | #x0ABC | [#x0ABE-#x0AC5] | [#x0AC7-#x0AC9] | [#x0ACB-#x0ACD] | [#x0B01-#x0B03] | #x0B3C | [#x0B3E-#x0B43] | [#x0B47-#x0B48] | [#x0B4B-#x0B4D] | [#x0B56-#x0B57] | [#x0B82-#x0B83] | [#x0BBE-#x0BC2] | [#x0BC6-#x0BC8] | [#x0BCA-#x0BCD] | #x0BD7 | [#x0C01-#x0C03] | [#x0C3E-#x0C44] | [#x0C46-#x0C48] | [#x0C4A-#x0C4D] | [#x0C55-#x0C56] | [#x0C82-#x0C83] | [#x0CBE-#x0CC4] | [#x0CC6-#x0CC8] | [#x0CCA-#x0CCD] | [#x0CD5-#x0CD6] | [#x0D02-#x0D03] | [#x0D3E-#x0D43] | [#x0D46-#x0D48] | [#x0D4A-#x0D4D] | #x0D57 | #x0E31 | [#x0E34-#x0E3A] | [#x0E47-#x0E4E] | #x0EB1 | [#x0EB4-#x0EB9] | [#x0EBB-#x0EBC] | [#x0EC8-#x0ECD] | [#x0F18-#x0F19] | #x0F35 | #x0F37 | #x0F39 | #x0F3E | #x0F3F | [#x0F71-#x0F84] | [#x0F86-#x0F8B] | [#x0F90-#x0F95] | #x0F97 | [#x0F99-#x0FAD] | [#x0FB1-#x0FB7] | #x0FB9 | [#x20D0-#x20DC] | #x20E1 | [#x302A-#x302F] | #x3099 | #x309A
	public is_CombiningChar(): boolean {
		return this.select([
			() => {return this.range(0x0300,0x0345)},
			() => {return this.range(0x0360,0x0361)},
			() => {return this.range(0x0483,0x0486)},
			() => {return this.range(0x0591,0x05A1)},
			() => {return this.range(0x05A3,0x05B9)},
			() => {return this.range(0x05BB,0x05BD)},
			() => {return this.range(0x05C1,0x05C2)},
			() => {return this.range(0x064B,0x0652)},
			() => {return this.range(0x06D6,0x06DC)},
			() => {return this.range(0x06DD,0x06DF)},
			() => {return this.range(0x06E0,0x06E4)},
			() => {return this.range(0x06E7,0x06E8)},
			() => {return this.range(0x06EA,0x06ED)},
			() => {return this.range(0x0901,0x0903)},
			() => {return this.range(0x093E,0x094C)},
			() => {return this.range(0x0951,0x0954)},
			() => {return this.range(0x0962,0x0963)},
			() => {return this.range(0x0981,0x0983)},
			() => {return this.range(0x09C0,0x09C4)},
			() => {return this.range(0x09C7,0x09C8)},
			() => {return this.range(0x09CB,0x09CD)},
			() => {return this.range(0x09E2,0x09E3)},
			() => {return this.range(0x0A40,0x0A42)},
			() => {return this.range(0x0A47,0x0A48)},
			() => {return this.range(0x0A4B,0x0A4D)},
			() => {return this.range(0x0A70,0x0A71)},
			() => {return this.range(0x0A81,0x0A83)},
			() => {return this.range(0x0ABE,0x0AC5)},
			() => {return this.range(0x0AC7,0x0AC9)},
			() => {return this.range(0x0ACB,0x0ACD)},
			() => {return this.range(0x0B01,0x0B03)},
			() => {return this.range(0x0B3E,0x0B43)},
			() => {return this.range(0x0B47,0x0B48)},
			() => {return this.range(0x0B4B,0x0B4D)},
			() => {return this.range(0x0B56,0x0B57)},
			() => {return this.range(0x0B82,0x0B83)},
			() => {return this.range(0x0BBE,0x0BC2)},
			() => {return this.range(0x0BC6,0x0BC8)},
			() => {return this.range(0x0BCA,0x0BCD)},
			() => {return this.range(0x0C01,0x0C03)},
			() => {return this.range(0x0C3E,0x0C44)},
			() => {return this.range(0x0C46,0x0C48)},
			() => {return this.range(0x0C4A,0x0C4D)},
			() => {return this.range(0x0C55,0x0C56)},
			() => {return this.range(0x0C82,0x0C83)},
			() => {return this.range(0x0CBE,0x0CC4)},
			() => {return this.range(0x0CC6,0x0CC8)},
			() => {return this.range(0x0CCA,0x0CCD)},
			() => {return this.range(0x0CD5,0x0CD6)},
			() => {return this.range(0x0D02,0x0D03)},
			() => {return this.range(0x0D3E,0x0D43)},
			() => {return this.range(0x0D46,0x0D48)},
			() => {return this.range(0x0D4A,0x0D4D)},
			() => {return this.range(0x0E34,0x0E3A)},
			() => {return this.range(0x0E47,0x0E4E)},
			() => {return this.range(0x0EB4,0x0EB9)},
			() => {return this.range(0x0EBB,0x0EBC)},
			() => {return this.range(0x0EC8,0x0ECD)},
			() => {return this.range(0x0F18,0x0F19)},
			() => {return this.range(0x0F71,0x0F84)},
			() => {return this.range(0x0F86,0x0F8B)},
			() => {return this.range(0x0F90,0x0F95)},
			() => {return this.range(0x0F99,0x0FAD)},
			() => {return this.range(0x0FB1,0x0FB7)},
			() => {return this.range(0x20D0,0x20DC)},
			() => {return this.range(0x302A,0x302F)},
			() => {return this.code_is(0x05BF)},
			() => {return this.code_is(0x05C4)},
			() => {return this.code_is(0x0670)},
			() => {return this.code_is(0x093C)},
			() => {return this.code_is(0x094D)},
			() => {return this.code_is(0x09BC)},
			() => {return this.code_is(0x09BE)},
			() => {return this.code_is(0x09BF)},
			() => {return this.code_is(0x09D7)},
			() => {return this.code_is(0x0A02)},
			() => {return this.code_is(0x0A3C)},
			() => {return this.code_is(0x0A3E)},
			() => {return this.code_is(0x0A3F)},
			() => {return this.code_is(0x0ABC)},
			() => {return this.code_is(0x0B3C)},
			() => {return this.code_is(0x0BD7)},
			() => {return this.code_is(0x0D57)},
			() => {return this.code_is(0x0E31)},
			() => {return this.code_is(0x0EB1)},
			() => {return this.code_is(0x0F35)},
			() => {return this.code_is(0x0F37)},
			() => {return this.code_is(0x0F39)},
			() => {return this.code_is(0x0F3E)},
			() => {return this.code_is(0x0F3F)},
			() => {return this.code_is(0x0F97)},
			() => {return this.code_is(0x0FB9)},
			() => {return this.code_is(0x20E1)},
			() => {return this.code_is(0x3099)},
			() => {return this.code_is(0x309A)},
		]);
	}

	//	[#x0030-#x0039] | [#x0660-#x0669] | [#x06F0-#x06F9] | [#x0966-#x096F] | [#x09E6-#x09EF] | [#x0A66-#x0A6F] | [#x0AE6-#x0AEF] | [#x0B66-#x0B6F] | [#x0BE7-#x0BEF] | [#x0C66-#x0C6F] | [#x0CE6-#x0CEF] | [#x0D66-#x0D6F] | [#x0E50-#x0E59] | [#x0ED0-#x0ED9] | [#x0F20-#x0F29]
	public is_Digit(): boolean {
		return this.select([
			() => {return this.range(	0x0030,0x0039)},
			() => {return this.range(	0x0660,0x0669)},
			() => {return this.range(	0x06F0,0x06F9)},
			() => {return this.range(	0x0966,0x096F)},
			() => {return this.range(	0x09E6,0x09EF)},
			() => {return this.range(	0x0A66,0x0A6F)},
			() => {return this.range(	0x0AE6,0x0AEF)},
			() => {return this.range(	0x0B66,0x0B6F)},
			() => {return this.range(	0x0BE7,0x0BEF)},
			() => {return this.range(	0x0C66,0x0C6F)},
			() => {return this.range(	0x0CE6,0x0CEF)},
			() => {return this.range(	0x0D66,0x0D6F)},
			() => {return this.range(	0x0E50,0x0E59)},
			() => {return this.range(	0x0ED0,0x0ED9)},
			() => {return this.range(	0x0F20,0x0F29)}
		]);
	}

	//	#x00B7 | #x02D0 | #x02D1 | #x0387 | #x0640 | #x0E46 | #x0EC6 | #x3005 | [#x3031-#x3035] | [#x309D-#x309E] | [#x30FC-#x30FE]
	public is_Extender(): boolean {
		return this.select([
			() => {return this.code_is(0x00B7)},
			() => {return this.code_is(0x02D0)},
			() => {return this.code_is(0x02D1)},
			() => {return this.code_is(0x0387)},
			() => {return this.code_is(0x0640)},
			() => {return this.code_is(0x0E46)},
			() => {return this.code_is(0x0EC6)},
			() => {return this.code_is(0x3005)},
			() => {return this.range(0x3031,0x3035)},
			() => {return this.range(0x309D,0x309E)},
			() => {return this.range(0x30FC,0x30FE)},
		])
	}

}



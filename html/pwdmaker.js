/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// Smart Password Maker                                                            //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
// Concept, design and programming by Jens Sandalgaard                             //
// v1.4 2021-08-31                                                                 //
// https://github.com/iens/smartpasswordmaker                                      //
//                                                                                 //
// Copyright (c) 2021 Jens Sandalgaard                                             //
//                                                                                 //
// Permission is hereby granted, free of charge, to any person obtaining           //
// a copy of this software and associated documentation files (the                 //
// "Software"), to deal in the Software without restriction, including             //
// without limitation the rights to use, copy, modify, merge, publish,             //
// distribute, sublicense, and/or sell copies of the Software, and to              //
// permit persons to whom the Software is furnished to do so, subject to           //
// the following conditions:                                                       //
//                                                                                 //
// The above copyright notice and this permission notice shall be                  //
// included in all copies or substantial portions of the Software.                 //
//                                                                                 //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,                 //
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF              //
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND                           //
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE          //
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION          //
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION           //
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                 //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
// Credits:                                                                        //
// SHA256 from https://www.quora.com/How-do-I-generate-sha256-key-in-javascript    //
// hexToComplimentary from https://stackoverflow.com/a/37657940                    //
// VT323 font by Peter Hull: https://www.1001fonts.com/vt323-font.html             //
/////////////////////////////////////////////////////////////////////////////////////


// Configuration constants:
var passwordLength = 16;				// Length of generated password without separators
const charsMin = new Array (2,2,2,2);	// Minimum number of characters from each charSet to use in generated password
const separatorChar = "-";				// Character to use as separator in generated password
var groupLength = 4;					// Length of each group of characters, separated by the separatorChar
const charSets =	new Array(	new Array("a","b","c","d","e","f","g","h","j","k","m","n","p","q","r","s","t","u","v","x","y","z"),		// Set 0: Lower Case Letters, excluding hard to distinguish letters
								new Array("A","B","C","D","E","F","G","H","J","K","M","N","P","R","S","T","U","V","X","Z"),				// Set 1: Upper Case Letters, excluding hard to distinguish letters
								new Array("2","3","4","5","6","7","8","9"),																// Set 2: Numbers, excluding hard to distinguish numbers
								new Array("@","!","$","#","%"));																		// Set 3: Special Characters
const appTitle = "Smart Password Maker v1.4";

// derived constants
const charSetFull = charSets[0].concat(charSets[1].concat(charSets[2].concat(charSets[3]))); 
const charSetsLength = new Array (charSets[0].length,charSets[1].length,charSets[2].length,charSets[3].length)
const charSetFullLength = charSetFull.length;
const numberOfCharSets = charSets.length;


function passwordFullLength() {
	return(passwordLength + Math.ceil((passwordLength/groupLength)-1) );
}

function init() {
	document.getElementById('secret').focus();
	document.getElementById("Title").innerHTML=appTitle;
	document.title=appTitle;
}

function secretChanged() {
	makeVerificationKey();
	makePassword();
}

function websiteChanged() {
	makePassword();
}

function handleSecretInput(e) {
	// If Enter is pressed in the secret field, jump to the website field
	if (e.keyCode === 13) {
		e.preventDefault();
		document.getElementById("website").focus();
	}
}

function handleWebsiteInput(e) {
	//check if the keypress was an Enter in the website field
	if (e.keyCode === 13) {
		e.preventDefault();
		copyToClipboard();
	}
}

function makeVerificationKey() {
	// Calculate and display the Verification image
	secret=document.getElementById("secret").value;
	if (secret.length > 0) {
		hashArray=SHA256(secret);
		verificationNumber = (hashArray[1].toString(16).padStart(2,"0") + "-" + hashArray[2].toString(16).padStart(2,"0") + "-" + hashArray[3].toString(16).padStart(2,"0")).toUpperCase();
		watermarkBackgroundColor = "#" + (hashArray[4] + (hashArray[5] * 256) + (hashArray[6] * 65536)).toString(16).padStart(6,"0");
		verificationNumberFrameColor = "#" + (hashArray[7] + (hashArray[8] * 256) + (hashArray[9] * 65536)).toString(16).padStart(6,"0");
		verificationNumberBackgroundColor = "#" + (hashArray[10] + (hashArray[11] * 256) + (hashArray[12] * 65536)).toString(16).padStart(6,"0");
		verificationNumberTextColor = hexToComplimentary(verificationNumberBackgroundColor);
		rotate = (hashArray[13] % 90) - 45;
		verificationCrossColorH = "#" + (hashArray[14] + (hashArray[15] * 256) + (hashArray[16] * 65536)).toString(16).padStart(6,"0");
		verificationCrossColorV = "#" + (hashArray[17] + (hashArray[18] * 256) + (hashArray[19] * 65536)).toString(16).padStart(6,"0");
		verificationCrossH = (hashArray[20] % 88);
		verificationCrossV = (hashArray[21] % 88);

		document.getElementById("verificationKey").innerHTML = verificationNumber;
		document.getElementById("verificationKey").style.transform = "rotate(" + rotate + "deg)";
		document.getElementById("verificationKey").style.borderColor = verificationNumberFrameColor;
		document.getElementById("verificationKey").style.background = verificationNumberBackgroundColor;
		document.getElementById("watermark").style.color = verificationNumberTextColor;
		document.getElementById("watermark").style.background = watermarkBackgroundColor;
		document.getElementById("watermarkBloom").style.boxShadow="0 0 17px 3px " + watermarkBackgroundColor+"80";
		document.getElementById("verificationCrossH").style.background = verificationCrossColorH+"50";
		document.getElementById("verificationCrossV").style.background = verificationCrossColorV+"50";
		document.getElementById("verificationCrossH").style.top = verificationCrossH+"px";
		document.getElementById("verificationCrossV").style.left = verificationCrossV+"px";
	} else {
		document.getElementById("verificationKey").innerHTML = "0";
		document.getElementById("verificationKey").style.transform = "rotate(-20deg)";
		document.getElementById("verificationKey").style.borderColor = "#1a1a2e";
		document.getElementById("verificationKey").style.background = "#1a1a2e";
		document.getElementById("watermark").style.color = "#1a1a2e";
		document.getElementById("watermark").style.background = "#1a1a2e";
		document.getElementById("watermarkBloom").style.boxShadow="0 0 17px 3px #00000080";
		document.getElementById("verificationCrossH").style.background = "#00000000";
		document.getElementById("verificationCrossV").style.background = "#00000000";
	}
}

function makePassword() {
	// get information from web form
	secret=document.getElementById("secret").value;
	website=document.getElementById("website").value;
	
	if (website.length < 1 || secret.length < 1) {
		// Don't calculate a password if no website is present
		document.getElementById("result").innerHTML = "";
		return("");
	}

	// convert secret and website into a password
	hashArray = generateHashArrayFromPasswordAndwebsite(secret,website);
	rawPassword=generatePasswordFromHash(hashArray);
	trimmedPassword = rawPassword.substr(0,passwordLength);
	fixedPassword = enforceRules(trimmedPassword,hashArray);	
	finishedPassword = splitPasswordIntoGroups(fixedPassword);
	// Return result to web form
	if (document.getElementById("showPassword").checked) {
		document.getElementById("result").innerHTML = finishedPassword;
	} else {
		document.getElementById("result").innerHTML = "*".repeat(passwordFullLength());
	}
	return(finishedPassword);
}	

function copyToClipboard() {
	// Copy the password to the clipboard as text
	// make sure the password is up-to-date first
	pwd = makePassword();
	if (pwd != "") {
		navigator.clipboard.writeText(pwd);
	}
	var notificationBox = document.getElementById("notification").style;
	notificationBox.transitionDuration = "0s";
	notificationBox.backgroundColor='#FFFFFFFF';
	notificationBox.color='#000000FF';
	notificationBox.borderColor="#929292FF";
	notificationBox.visibility="visible";
	setTimeout(function(){
		notificationBox.transitionTimingFunction="ease-out";
		notificationBox.transitionDuration = "2000ms";
		notificationBox.backgroundColor='#FFFFFF00';
		notificationBox.color='#00000000';
		notificationBox.borderColor="#92929200";
		notificationBox.visibility="hidden";
	}, 100);

}

function clearClipboard() {
	navigator.clipboard.writeText('Clear');
}

function generateHashArrayFromPasswordAndwebsite(secret,website) {
	// Create a long string from secret, website
	saltedString="iEns" + secret + "iEns" + cleanWebsite(website) + "iEns";
	hashArray=SHA256(saltedString);
	return(hashArray);
}

function generatePasswordFromHash(hashArray) {
	// Convert hashArray into a string
	passwordBuilderString = "";
	for (var i=0; i<32; i++) {
		passwordBuilderString += charSetFull[(hashArray[i]) % charSetFullLength];
	}
	return(passwordBuilderString);
}

function cleanWebsite(website) {
	// Removes anything but numbers and letters
	website = website.toLowerCase();
	website = website.replace(/[^a-z0-9]/gi, '');
	return(website);
}

function checkRule(charSetNumber, password) {
	// Check if enough characters of the selected type are present in password
	// Return true if we found enough characters of the selected type to satify our rules
	found=countCharsFromCharSet(charSetNumber, password);
	if (found >= charsMin[charSetNumber]) {
		return(true);
	} else {
		return(false);
	}
}

function countCharsFromCharSet(charSetNumber, password) {
	// count how many characters we can find in our password from this characterset
	found = 0;
	for (var i=0; i<password.length; i++) {
		if (charSets[charSetNumber].includes(password.charAt(i))) {
			found++;
		}
	}
	return(found);
}

function findLeastBrokenRule(password) {
	// Returns the number of the first characterset that has the most characters excess present in the password.
	var winner = 0;
	var topScore = 0;
	for (var i=0; i<numberOfCharSets; i++) {
		found=countCharsFromCharSet(i,password)-charsMin[i]; //Subtract the min number of characters to get the number of excess characters in this rule
		if (found > topScore) {
			topScore=found;
			winner=i;
		}
	}
	return(winner);
}

function enforceRules(password, hashArray) {
	// enforce all the rules on password, and fix if rules are broken
	var allGood = false;
	//repeat until all rules are satisfied at the same time
	while (allGood==false){
		allGood=true; // Assume true until one rule is confirmed broken
		for (var i=0; i<numberOfCharSets; i++){
			if (checkRule(i,password)==false) {
				allGood=false;
				password = fixRule(i,password,hashArray);
			}
		}
		//check for repeated characters
		for (var i=2; i<password.length; i++) {
			if (password.charAt(i) == password.charAt(i-1) && password.charAt(i-1) == password.charAt(i-2)) {
				//We found a duplicate character. Lets add one to the hash
				allGood=false;
				hashArray[i] = (hashArray[i] + 1) & 255; // Increase by 1 and fit the result in a byte
				password = password.replaceAt(i,charSetFull[(hashArray[i]) % charSetFullLength]);
			}
		}
	}
	return(password);
}


function fixRule(brokenRule,password,hashArray) {
	//changes a character from the least broken rule into a character from the most broken rule
	var leastBrokenRule = findLeastBrokenRule(password);
	
	// find first character that we can change. We offset the counting by brokenrule, to make sure that we don't always change the very first character.
	charPositionToReplace = findFirstCharacterFromCharSet(leastBrokenRule,password,brokenRule);
	newChar=charSets[brokenRule][(hashArray[charPositionToReplace]) % charSetsLength[brokenRule]];
	//password=password.substring(0,charPositionToReplace) + newChar + password.substr(charPositionToReplace+1);
	password=password.replaceAt(charPositionToReplace, newChar);
	return(password);
}

function findFirstCharacterFromCharSet(charSetNumber, password, offset=0) {
	// Returns the position of the first character we found from the selected characterset
	for (var i=0+offset; i<password.length; i++) {
		if (charSets[charSetNumber].includes(password.charAt(i))) {
			return(i);
		}
	}
}

function splitPasswordIntoGroups(password) {
	// If groupLength if shorter than the desired password, split the password into groups, separated by the separatorChar. Else return the unmodified password.
	if (groupLength < password.length && groupLength > 0) {
		var groupedPassword = "";
		for (var i = 0; i < password.length; i += groupLength) {
			if (i != 0) {
				groupedPassword += separatorChar;
			}
			groupedPassword += password.substr(i, groupLength);
		}
		return (groupedPassword);
	} else {
		return (password);
	}
}


// Create a string Character replacement procedure
String.prototype.replaceAt = function(index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}



//
// Original SHA256 function from: https://www.quora.com/How-do-I-generate-sha256-key-in-javascript
//
function SHA256(s) {
	var chrsz = 8;
	var hexcase = 0;
	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
	function S(X, n) { return (X >>> n) | (X << (32 - n)); }
	function R(X, n) { return (X >>> n); }
	function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
	function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
	function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
	function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
	function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
	function core_sha256(m, l) {
		var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
		var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;
		for (var i = 0; i < m.length; i += 16) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];
			for (var j = 0; j < 64; j++) {
				if (j < 16) W[j] = m[j + i];
				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));
				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}
			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}
	function str2binb(str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for (var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
		}
		return bin;
	}
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	}
	function binToByteArray(binarray){
		var byteArray=new Array();		
		for (var i=0; i<binarray.length; i++) {
			byteArray.push((binarray[i] >> 24) & 255);
			byteArray.push((binarray[i] >> 16) & 255);
			byteArray.push((binarray[i] >> 8) & 255);
			byteArray.push(binarray[i] & 255);
		}
		return(byteArray);
	}
	s = Utf8Encode(s);
	return binToByteArray(core_sha256(str2binb(s), s.length * chrsz));
}

function byteArrayToHEX(binArray) {
	hexString="";
	for (var i=0;i<binArray.length;i++) {
		hexString += binArray[i].toString(16).padStart(2,"0");
	}
	return(hexString.toUpperCase());
}


/* hexToComplimentary : Converts hex value to HSL, shifts
 * hue by 180 degrees and then converts hex, giving complimentary color
 * as a hex value
 * @param  [String] hex : hex value  
 * @return [String] : complimentary color as hex value
 */
// Original found here: https://stackoverflow.com/a/37657940
function hexToComplimentary(hex){

    // Convert hex to rgb
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

    // Get array of RGB values
    rgb = rgb.replace(/[^\d,]/g, '').split(',');

    var r = rgb[0], g = rgb[1], b = rgb[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if(max == min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if(max == r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= 180;
    if (h > 360) { h -= 360; }
    h /= 360;

	//make lightness different
	if (l>0.4) {l=0.04} else {l=0.96}

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if(s === 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255); 
    b = Math.round(b * 255);

    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16); 
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
} 
describe("Smart Password Maker", function() {
  
	it("should be able to calculate correct length of full password", function() {
		passwordLength = 12;
		groupLength = 4;
		expect(passwordFullLength()).toEqual(14);
		passwordLength = 13;
		expect(passwordFullLength()).toEqual(16);
		passwordLength = 14;
		expect(passwordFullLength()).toEqual(17);
		passwordLength = 15;
		expect(passwordFullLength()).toEqual(18);
		passwordLength = 17;
		expect(passwordFullLength()).toEqual(21);
		passwordLength = 16;
		expect(passwordFullLength()).toEqual(19);
	});
	
	it("should be able to calculate correct SHA256", function() {
		expect(byteArrayToHEX(SHA256("iEnstest123iEnstest456"))).toEqual("CD825758F5659F428740AF5493769D892EB6F119F774C63AD59C92995E0935DB");
		expect(byteArrayToHEX(SHA256("this is a long string and some numbers 1234567890 and some special characters ,./!@#$%^&*"))).toEqual("9486C3F1139B583CCF8E253B4AFE359B2817F5C9193102610A7BA3D50E31EB27");
	});
	
	it("should be able to calculate correct password", function() {
		passwordLength = 16;
		groupLength = 4;
		document.getElementById("secret").value = "test1234";
		document.getElementById("website").value = "testWebSite";
		expect(makePassword()).toEqual("E5rs-baJ%-mku@-86Bn");
		document.getElementById("website").value = "testwebsite";
		expect(makePassword()).toEqual("E5rs-baJ%-mku@-86Bn");
		document.getElementById("website").value = "test web-site";
		expect(makePassword()).toEqual("E5rs-baJ%-mku@-86Bn");
	});
	
	it("should be able to detect rule breaks", function() {
		expect(checkRule(0,"aBVCX$%453")).toEqual(false);
		expect(checkRule(0,"aBVCX$a%453")).toEqual(true);
		expect(checkRule(1,"aghdfhgX$%453")).toEqual(false);
		expect(checkRule(1,"aBVCX$a%453")).toEqual(true);
		expect(checkRule(2,"aghdfhgX$%4")).toEqual(false);
		expect(checkRule(2,"aBVCX$a%453")).toEqual(true);
		expect(checkRule(3,"aghdfhgX%4")).toEqual(false);
		expect(checkRule(3,"aBVCX$a%453")).toEqual(true);
	});
	
	it("should be able to find least broken rule", function() {
		expect(findLeastBrokenRule("aBX$a%43")).toEqual(0);
		expect(findLeastBrokenRule("aBVCX$a%453")).toEqual(1);
		expect(findLeastBrokenRule("aBVCX$a%!@!453")).toEqual(3);
		expect(findLeastBrokenRule("aB34VC71X2$a%9!@!453")).toEqual(2);
	});
	
	it("should be able to find and fix repeated chars", function() {
		//createPasswordWithTrippleRepeatedChars();
		document.getElementById("secret").value = "test";
		document.getElementById("website").value = "aajh";
		pwd = makePassword()
		expect(pwd).toEqual("vvx4-!%JR-N5Xx-SkCN");
		document.getElementById("website").value = "aato";
		pwd = makePassword()
		expect(pwd).toEqual("a7y#-3@rA-qEF2-7VVX");
	});
	
	function createPasswordWithTrippleRepeatedChars() {
		secret = "test";
		for (var c1="a".charCodeAt(0); c1<="z".charCodeAt(); c1++) {
			for (var c2="a".charCodeAt(0); c2<="z".charCodeAt(); c2++) {
				for (var c3="a".charCodeAt(0); c3<="z".charCodeAt(); c3++) {
					for (var c4="a".charCodeAt(0); c4<="z".charCodeAt(); c4++) {
						website = String.fromCharCode(c1) + String.fromCharCode(c2) + String.fromCharCode(c3) + String.fromCharCode(c4);
						hashArray = generateHashArrayFromPasswordAndwebsite(secret,website);
						rawPassword=generatePasswordFromHash(hashArray);
						password = rawPassword.substr(0,passwordLength);
						for (var i=password.length-1; i<=password.length; i++) {
							if (password.charAt(i) == password.charAt(i-1) && password.charAt(i-1) == password.charAt(i-2)) {
								//We found a duplicate character. 
								document.getElementById("secret").value = secret;
								document.getElementById("website").value = website;
								return;
							}
						}
					}
				}
			}
		}	
	}


});
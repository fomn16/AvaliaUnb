const match = "123T456".match(/^(\d*)(\D)(\d*)/);
console.log(match)
for (const c of match[1])
    console.log(c);
const crypto = require('crypto');
const { decrypt } = require('dotenv');

// TODO
function validPassword(password, hashStored, salt) {
    var hashPass = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hashStored === hashPass;
}


function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return{
        salt: salt,
        genHash: genHash
    }
}

function decryptRequest(originalkey,data){
    console.log(originalkey);
    // Convert the originalKey string to a buffer
    const buff = Buffer.from(originalkey, "utf-8");
    console.log(buff)

    try{
        const decipher = crypto.createDecipheriv('aes-256-ecb', Buffer.from(originalkey,'utf-8'), Buffer.alloc(0));
        let decryptedData = decipher.update(data, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');
        return decryptedData;
    }catch(err){
        return err;
    }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.decryptRequest = decryptRequest;

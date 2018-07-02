const isThisProdEnvironment = function () {
    return process.env.PORT != null;
}

module.exports = {
    isThisProdEnvironment
}
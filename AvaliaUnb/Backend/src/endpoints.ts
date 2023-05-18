export default () => {
    //route de teste
    global.app.get("/teste", (req, res, next) => {
        global.db.query("select * from departamento", function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    })
}
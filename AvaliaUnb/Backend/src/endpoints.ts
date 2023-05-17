export default (app, db) => {
    //route de teste
    app.get("/teste", (req, res, next) => {
        db.connect(function(err) {
            if (err) throw err;
            db.query("select * from departamento", function (err, result) {
                if (err) throw err;
                res.json(result);
            });
        });
    })
}
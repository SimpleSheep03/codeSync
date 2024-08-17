const f = async() => {
    const res = await fetch('https://codeforces.com/api/problemset.problems').then(async(data) => await data.json())
    const m = {}
    let total = 0
    for(const prob of res.result){
        if(prob.problem.rating){
            if(!m[prob.problem.rating]){
                m[prob.problem.rating] = 1
            }
            else{
                m[prob.problem.rating] ++
            }
            total ++;
        }
    }
    Object.entries(m).forEach((value , key) => {
        console.log(key , value)
    })
}
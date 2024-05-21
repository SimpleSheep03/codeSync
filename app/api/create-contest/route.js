export const POST = async (request) => {
    try {
        
        return new Response(JSON.stringify(request) , { status : 200 })
    } catch (error) {
        console.log(error)
    }
}
function UserDetailData({title, data}: {title: string, data: string}) {
    return(
        <>
            <div className="container ml-3">
                <h1 className="font-bold">{title}</h1>
                <h1>{data}</h1>
            </div>
        </>
    )
}

export default UserDetailData
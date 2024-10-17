function UserLogoProfile({logo}: {logo: any}) {
    return(
        <>
            <div className="container w-[12vw]">
                <img src={logo} alt="logo profile user" />
            </div>
        </>
    )
}

export default UserLogoProfile
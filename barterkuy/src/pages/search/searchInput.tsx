import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateThings } from "@/redux/thingsSlice";
import { Button } from "@/components/ui/button";
import SearchFilterModal from "@/components/modal/searchFilterModal";

function SearchInput() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [isFilter, setIsFilter] = useState<boolean>(false)

  const dispatch = useDispatch();

  const handleSearch = (e: any) => {
    e.preventDefault();

    dispatch(updateThings({ searchThings: searchInput }));
  };

  const handleClose = () => {
    setIsFilter(false)
  }

  return (
    <>
      <div className="container flex gap-2 p-2">
        <div className="container w-[80vw]">
          <form onSubmit={handleSearch}>
            <Input type="search" onChange={(e) => setSearchInput(e.target.value)} value={searchInput} />
          </form>
        </div>

        <div className="container w-[20vw]">
          <Button onClick={() => setIsFilter(true)}>Filter</Button>
        </div>
      </div>

      {isFilter && <SearchFilterModal onClose={handleClose}/>}
    </>
  );
}

export default SearchInput;

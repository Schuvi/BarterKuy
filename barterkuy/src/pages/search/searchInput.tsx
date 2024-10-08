import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateThings } from "@/redux/thingsSlice";
import { Button } from "@/components/ui/button";
import SearchFilterModal from "@/components/modal/searchFilterModal";
import { useSearchParams } from "react-router-dom";
import { RootState } from "@/redux/store";

function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState<string>("");
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const location = useSelector((state: RootState) => state.things.kabupatenThings)

  const dispatch = useDispatch();

  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearchParams({ nama_barang: searchInput, lokasi: location });

    dispatch(updateThings({ triggerSearch: true }));
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
          <Button type="button" onClick={() => setIsFilter(true)} className="bg-color1">Filter</Button>
        </div>
      </div>

      {isFilter && <SearchFilterModal onClose={handleClose}/>}
    </>
  );
}

export default SearchInput;

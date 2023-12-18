import { useState, useEffect } from "react";

const useFetchData = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");

        if (response.status !== 200) {
          alert("status is " + response.status);
          throw new Error("Error fetching data");
        }

        const jsonData = await response.json();

        // Adjust this line based on your needs
        // localStorage.setItem("currentUser", JSON.stringify(jsonData.users[0]));
        setData(jsonData);
        localStorage.setItem("comments", JSON.stringify(jsonData));
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    if (
      data.length < 1 &&
      isLoading
    ) {
      // alert(JSON.parse(localStorage.getItem("comments")).length);
      // alert(isLoading);
      fetchData();
    } else {
      // alert("not available");
      setData(JSON.parse(localStorage.getItem("comments")));
    }
  }, [isLoading]);

  return { data, error, isLoading };
};

export default useFetchData;
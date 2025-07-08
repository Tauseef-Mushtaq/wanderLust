
       let taxSwitch = document.getElementById("switchCheckDefault");
       taxSwitch.addEventListener("click", () => {
        let taxInfo = document.getElementsByClassName("tax-info");
        for(let info of taxInfo) {
            if(info.style.display != "inline") {
                info.style.display = "inline";
            } else {
                info.style.display = "none";
            }
        }
       })

       // Responsive filters menu toggle
    const filtersMenuBtn = document.getElementById('filtersMenuBtn');
    const filtersDiv = document.getElementById('filters');
    filtersMenuBtn.addEventListener('click', function() {
        filtersDiv.classList.toggle('active');
    });
    // Optional: Hide menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!filtersDiv.contains(e.target) && !filtersMenuBtn.contains(e.target)) {
            filtersDiv.classList.remove('active');
        }
    });

    // Filter functionality
  // This script will redirect to the listings page with the selected category as a query parameter
  const filters = document.querySelectorAll(".filter");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      const category = filter.getAttribute("data-category");
      window.location.href = `/listings/filters?category=${category}`;
    });
  });

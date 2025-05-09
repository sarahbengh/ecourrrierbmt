const EnregistrerUnCourrier = () => {
    const [courrier, setCourrier] = useState({
      type: 'arrivé',
      priority: '',
      dateEmail: '',
      arrivalDate: '',
      object: '',
      sender: '',
      initiatrice: '',
      traitante: '',
      listeDiffusion: [],
      file: null,
      fileName: ''
    });

    const [contactList, setContactList] = useState([]);
    const [diffusionList, setDiffusionList] = useState(["DGA", "DO", "DFC", "DMKT", "DRHM", "DT", "autre"]);
    const [userName, setUserName] = useState("");
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
      axios.get('/api/user', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(response => setUserName(response.data.name))
        .catch(error => console.error(error));

      axios.get('/api/contacts', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(response => setContactList(response.data))
        .catch(error => console.error(error));
    }, []);

    const handleFileChange = async (file) => {
      if (file) {
        setCourrier({ ...courrier, file, fileName: file.name });

        if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const text = await pdfDoc.getTextContent();
          setCourrier({ ...courrier, object: text.items[0].str || '' });
        }
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      setDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setCourrier({ ...courrier, [name]: value });
    };

    const handleDiffusionChange = (e) => {
      const { value, checked } = e.target;
      if (value === "autre" && checked) {
        const autre = prompt("Veuillez saisir l'entité:");
        setDiffusionList([...diffusionList, autre]);
        setCourrier({ ...courrier, listeDiffusion: [...courrier.listeDiffusion, autre] });
      } else if (checked) {
        setCourrier({ ...courrier, listeDiffusion: [...courrier.listeDiffusion, value] });
      } else {
        setCourrier({ ...courrier, listeDiffusion: courrier.listeDiffusion.filter(item => item !== value) });
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData();
      Object.keys(courrier).forEach(key => {
        formData.append(key, courrier[key]);
      });

      axios.post('/api/courriers', formData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } })
        .then(response => alert('Courrier enregistré avec succès!'))
        .catch(error => console.error(error));
    };

    const handleRemoveFile = () => {
      setCourrier({ ...courrier, file: null, fileName: '' });
    };
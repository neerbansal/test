with open("index.html", "w") as f:
    f.write("<!DOCTYPE html>\n<html>\n<head>\n<title>Overkill HTML</title>\n<style>\nbody { font-family: sans-serif; }\n.box { padding: 10px; margin: 5px; border: 1px solid #ccc; }\n</style>\n</head>\n<body>\n")
    f.write("<h1>Overkill 5000-Line HTML</h1>\n")
    for i in range(1, 5000):
        f.write(f'<div class="box">This is generated row number {i}</div>\n')
    f.write("</body>\n</html>\n")
print("index.html has been generated!")

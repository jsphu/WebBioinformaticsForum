from django.shortcuts import render, redirect
import pandas as pd
import os

def get_files_view(request):
    media_files = os.listdir(path='media/uploads/')
    data = [{'name': os.path.splitext(d)[0], 'full': d } for d in media_files]
    return render(request, 'selectfile.html', {'data': data})

def graph_view(request, file):
    if len(file) > 14:
        file_name = os.path.splitext(file)[0]
        file_ext = os.path.splitext(file)[1]
        file_short = file_name[:2] + "..." + file_name[-5:] + file_ext
    else:
        file_short = file
    try:
        df = pd.read_csv(os.path.join('media','uploads',file))
        data = df.to_dict(orient='records')  # convert to list of dicts
    except pd.errors.ParserError:
        data = [{"null": "null", "error": "parser error"}]
    except FileNotFoundError:
        return render(request, 'error.html', {'filename': file_short, 'error_type': 404, 'message': 'is not found'})
    except:
        return render(request, 'error.html', {'filename': file_short, 'error_type': 500, 'message': 'is not valid' })
    return render(request, 'graph.html', {'data': data, 'filename': file})
